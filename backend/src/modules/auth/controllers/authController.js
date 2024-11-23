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
            const decoded = TokenUtils.verifyToken(token);
            
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
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
            const { password } = req.body;

            const decoded = TokenUtils.validateTokenPurpose(token, 'password_reset');
            const user = await User.findById(decoded.userId);

            if (!user) {
                throw new Error('User not found');
            }

            user.password = password;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password reset successful'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
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

}

module.exports = AuthController; 