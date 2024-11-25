const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const passport = require('passport');
const AuthService = require('../services/authService');
const SocialAuthService = require('../services/socialAuthService');
const TokenUtils = require('../utils/tokenUtils');
const EmailTemplates = require('../utils/emailTemplates');

class AuthController {
    // Register new user
    static async register(req, res) {
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

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    static async logout(req, res) {
        try {
            const refreshToken = req.body.refreshToken;
            
            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token is required'
                });
            }

            await AuthService.logout(refreshToken);

            res.json({
                success: true,
                message: 'Successfully logged out'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error logging out',
                error: error.message
            });
        }
    }

    // Verify email
    static async verifyEmail(req, res) {
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
    static async requestPasswordReset(req, res) {
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
    static async resetPassword(req, res) {
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
    static async googleCallback(req, res) {
        try {
            const token = TokenUtils.generateToken({ userId: req.user._id });
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }
    }

    // Facebook OAuth callback
    static async facebookCallback(req, res) {
        try {
            const token = TokenUtils.generateToken({ userId: req.user._id });
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }
    }

    // GitHub OAuth callback
    static async githubCallback(req, res) {
        try {
            const token = TokenUtils.generateToken({ userId: req.user._id });
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }
    }

    static handleSocialAuthCallback(req, res) {
        const redirectUrl = req.user?.redirectUrl || `${process.env.FRONTEND_URL}/login`;
        const token = req.user?.token;

        // Redirect with token as a query parameter
        res.redirect(`${redirectUrl}?token=${token}`);
    }

}

module.exports = AuthController; 