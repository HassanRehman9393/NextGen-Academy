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

            // Create new user with isVerified set to false
            const user = new User({
                ...userData,
                isVerified: false
            });
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

            // Send only verification email during registration
            await this.sendVerificationEmail(user, verificationToken);

            return {
                message: 'Registration successful. Please check your email for verification.',
                userId: user._id
            };
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
            throw error;
        }
    }

    // Request password reset
    async requestPasswordReset(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return; // Don't reveal user existence
            }

            const resetToken = TokenUtils.generatePasswordResetToken(user._id);
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

            // Save reset token
            await Token.create({
                userId: user._id,
                token: resetToken,
                type: 'reset',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });

            return true;
        } catch (error) {
            console.error('Password reset request failed:', error);
            throw error;
        }
    }

    // Reset password
    async resetPassword(token, newPassword) {
        try {
            console.log('Starting password reset process');

            // Verify token
            let decoded;
            try {
                decoded = TokenUtils.verifyToken(token);
                console.log('Token decoded:', { userId: decoded.userId, purpose: decoded.purpose });
            } catch (error) {
                console.error('Token verification failed:', error);
                throw new Error('Invalid or expired reset token');
            }

            // Validate decoded token
            if (!decoded.userId || decoded.purpose !== 'password_reset') {
                console.error('Invalid token purpose or missing userId:', decoded);
                throw new Error('Invalid reset token');
            }

            // Find token in database
            const tokenDoc = await Token.findOne({
                token,
                type: 'reset'
            });

            if (!tokenDoc) {
                console.error('Token not found in database');
                throw new Error('Reset token has expired or already been used');
            }

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user) {
                console.error('User not found:', decoded.userId);
                throw new Error('User not found');
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update user password
            user.password = hashedPassword;
            await user.save();
            console.log('Password updated successfully');

            // Delete the used token
            await Token.deleteOne({ _id: tokenDoc._id });
            console.log('Reset token deleted');

            return true;
        } catch (error) {
            console.error('Password reset failed:', error);
            throw error;
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
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('User not found');
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid password');
            }

            // Make sure we return the complete user object
            return {
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    roles: user.roles
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