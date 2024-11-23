const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const TokenUtils = require('../utils/tokenUtils');
const EmailTemplates = require('../utils/emailTemplates');

class AuthService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    // Register new user
    async register(userData) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Create new user
            const user = new User(userData);
            await user.save();

            // Generate verification token
            const verificationToken = TokenUtils.generateVerificationToken(user._id);

            // Save verification token
            await Token.create({
                userId: user._id,
                token: verificationToken,
                type: 'verification',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            });

            // Send welcome and verification emails
            await this.sendWelcomeEmail(user);
            await this.sendVerificationEmail(user, verificationToken);

            // Generate access token
            return TokenUtils.generateToken({
                userId: user._id,
                roles: user.roles
            });
        } catch (error) {
            throw error;
        }
    }

    // Validate user credentials
    async validateCredentials(email, password) {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return user;
    }

    // Send welcome email
    async sendWelcomeEmail(user) {
        try {
            const template = EmailTemplates.getWelcomeTemplate(user.firstName);
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: user.email,
                ...template
            });
        } catch (error) {
            console.error('Welcome email sending failed:', error);
            // Don't throw error to prevent registration failure
        }
    }

    // Send verification email
    async sendVerificationEmail(user, verificationToken) {
        try {
            const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
            const template = EmailTemplates.getVerificationTemplate(
                user.firstName,
                verificationLink
            );

            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: user.email,
                ...template
            });
        } catch (error) {
            console.error('Verification email sending failed:', error);
        }
    }

    // Request password reset
    async requestPasswordReset(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        // Generate reset token
        const resetToken = TokenUtils.generatePasswordResetToken(user._id);

        // Save reset token
        await Token.create({
            userId: user._id,
            token: resetToken,
            type: 'reset',
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });

        // Send reset email
        try {
            const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            const template = EmailTemplates.getPasswordResetTemplate(
                user.firstName,
                resetLink
            );

            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: user.email,
                ...template
            });
        } catch (error) {
            console.error('Password reset email sending failed:', error);
            throw new Error('Password reset email sending failed');
        }
    }

    // Reset password
    async resetPassword(token, newPassword) {
        // Verify token and get user
        const decoded = TokenUtils.validateTokenPurpose(token, 'password_reset');
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Delete used reset token
        await Token.deleteOne({ token, type: 'reset' });

        // Send password changed confirmation
        try {
            const template = EmailTemplates.getPasswordChangedTemplate(user.firstName);
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: user.email,
                ...template
            });
        } catch (error) {
            console.error('Password change confirmation email failed:', error);
        }
    }

    // Verify email
    async verifyEmail(token) {
        const decoded = TokenUtils.validateTokenPurpose(token, 'verification');
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        user.isVerified = true;
        await user.save();

        // Delete used verification token
        await Token.deleteOne({ token, type: 'verification' });

        return user;
    }

    // Refresh token validation
    async validateRefreshToken(refreshToken) {
        const tokenDoc = await Token.findOne({ 
            token: refreshToken,
            type: 'refresh'
        });

        if (!tokenDoc) {
            throw new Error('Invalid refresh token');
        }

        const decoded = TokenUtils.verifyToken(refreshToken);
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    // Add this new login method
    async login(email, password) {
        try {
            // Validate credentials
            const user = await this.validateCredentials(email, password);

            // Generate access token
            const accessToken = TokenUtils.generateToken({
                userId: user._id,
                roles: user.roles
            });

            // Generate refresh token
            const refreshToken = TokenUtils.generateRefreshToken(user._id);

            // Save refresh token
            await Token.create({
                userId: user._id,
                token: refreshToken,
                type: 'refresh',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });

            // Return user data and tokens
            return {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roles: user.roles,
                    isVerified: user.isVerified
                },
                tokens: {
                    accessToken,
                    refreshToken
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async logout(refreshToken) {
        try {
            // Delete the refresh token from the database
            await Token.deleteOne({ 
                token: refreshToken,
                type: 'refresh'
            });
            
            return true;
        } catch (error) {
            throw new Error('Error during logout');
        }
    }
}

module.exports = new AuthService(); 