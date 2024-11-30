const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const passport = require('passport');
const AuthService = require('../services/authService');
const SocialAuthService = require('../services/socialAuthService');
const TokenUtils = require('../utils/tokenUtils');
const EmailTemplates = require('../utils/emailTemplates');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor() {
        // Initialize any required services or dependencies
    }

    // Register new user
    async register(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;
            
            // Create user and generate token
            const result = await AuthService.register({
                email,
                password,
                firstName,
                lastName
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please check your email for verification.',
                token: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Generate tokens
    generateTokens(user) {
        const accessToken = jwt.sign(
            { 
                userId: user._id.toString(),
                email: user.email,
                roles: user.roles 
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id.toString() },
            process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    // Login handler
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);

            const { accessToken, refreshToken } = this.generateTokens(result.user);

            // Calculate expiration date for refresh token (7 days from now)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            // Store refresh token in database with expiration
            await Token.create({
                userId: result.user._id,
                token: refreshToken,
                type: 'refresh',
                expiresAt: expiresAt
            });

            res.json({
                success: true,
                data: {
                    token: accessToken,
                    refreshToken: refreshToken,
                    user: {
                        _id: result.user._id,
                        email: result.user.email,
                        firstName: result.user.firstName,
                        lastName: result.user.lastName,
                        roles: result.user.roles
                    }
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Refresh token handler
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            // Verify refresh token exists in database and is not expired
            const storedToken = await Token.findOne({ 
                token: refreshToken,
                type: 'refresh',
                expiresAt: { $gt: new Date() }
            });

            if (!storedToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired refresh token'
                });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Generate new tokens
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
                this.generateTokens(user);

            // Calculate new expiration date
            const newExpiresAt = new Date();
            newExpiresAt.setDate(newExpiresAt.getDate() + 7);

            // Update refresh token in database
            await Token.findByIdAndUpdate(storedToken._id, {
                token: newRefreshToken,
                expiresAt: newExpiresAt
            });

            res.json({
                success: true,
                data: {
                    token: newAccessToken,
                    refreshToken: newRefreshToken
                }
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
    }

    // Logout handler
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            // Remove refresh token from database
            await Token.deleteOne({ token: refreshToken });

            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during logout'
            });
        }
    }

    // Verify email
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            
            // First verify the token
            let decoded;
            try {
                decoded = TokenUtils.verifyToken(token);
                if (!decoded.userId || decoded.purpose !== 'verification') {
                    throw new Error('Invalid verification token');
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired verification link'
                });
            }

            // Find the token in the database
            const tokenDoc = await Token.findOne({
                token,
                type: 'verification',
                userId: decoded.userId
            });

            if (!tokenDoc) {
                return res.status(400).json({
                    success: false,
                    message: 'Verification link has expired or already been used'
                });
            }

            // Find and update the user
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (user.isVerified) {
                await Token.deleteOne({ _id: tokenDoc._id });
                return res.status(400).json({
                    success: false,
                    message: 'Email already verified. Please login.'
                });
            }

            // Update user verification status
            user.isVerified = true;
            await user.save();

            // Delete the verification token
            await Token.deleteOne({ _id: tokenDoc._id });

            return res.status(200).json({
                success: true,
                message: 'Email verified successfully. You can now login.'
            });
        } catch (error) {
            console.error('Email verification error:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred during email verification'
            });
        }
    }

    // Request password reset
    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            await AuthService.requestPasswordReset(email);

            res.status(200).json({
                success: true,
                message: 'Password reset instructions sent to your email'
            });
        } catch (error) {
            console.error('Password reset request error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Reset password
    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;

            console.log('Reset password attempt:', { token, hasPassword: !!newPassword });

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Reset token is required'
                });
            }

            if (!newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'New password is required'
                });
            }

            // Verify token and update password
            await AuthService.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: 'Password reset successful'
            });
        } catch (error) {
            console.error('Password reset error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Password reset failed'
            });
        }
    }

    // Google OAuth callback
    async googleCallback(req, res) {
        try {
            const token = TokenUtils.generateToken({ userId: req.user._id });
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }
    }

    // Facebook OAuth callback
    async facebookCallback(req, res) {
        try {
            const token = TokenUtils.generateToken({ userId: req.user._id });
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }
    }

    // GitHub OAuth callback
    async githubCallback(req, res) {
        try {
            const token = req.user.token;
            res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
        } catch (error) {
            console.error('GitHub callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }

    handleSocialAuthCallback(req, res) {
        const redirectUrl = req.user?.redirectUrl || `${process.env.FRONTEND_URL}/login`;
        const token = req.user?.token;

        // Redirect with token as a query parameter
        res.redirect(`${redirectUrl}?token=${token}`);
    }

    getProfile(req, res) {
        try {
            // Implementation
            res.json({ success: true, data: req.user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Missing methods that need to be added:
    static async updateProfile(req, res) {
        try {
            // Implementation needed
            throw new Error('Not implemented');
        } catch (error) {
            throw error;
        }
    }

    static async refreshToken(req, res) {
        try {
            // Implementation needed
            throw new Error('Not implemented');
        } catch (error) {
            throw error;
        }
    }

}

module.exports = AuthController;