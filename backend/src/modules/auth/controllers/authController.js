const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const passport = require('passport');
const authService = require('../services/authService');
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
            const { email } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Create user with isVerified set to false
            const user = new User({
                ...req.body,
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

            // Generate verification link with correct path
            const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;
            
            // Send verification email
            await authService.sendVerificationEmail(user.email, user.firstName, verificationLink);

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please check your email to verify your account.',
                requiresVerification: true
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Registration failed'
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
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // For existing users who registered before verification system
            // Set them as verified if they weren't before
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }

            const result = await authService.login(email, password);

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
            res.status(500).json({
                success: false,
                message: error.message || 'Login failed'
            });
        }
    }

    // Refresh token handler
    async refreshToken(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const refreshToken = req.headers['x-refresh-token'];

            if (!authHeader || !refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const token = authHeader.split(' ')[1];

            try {
                // First verify the access token to get user info (ignore expiration)
                const decodedAccess = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
                
                // Verify refresh token exists and is valid
                const storedToken = await Token.findOne({ 
                    token: refreshToken,
                    type: 'refresh',
                    userId: decodedAccess.userId,
                    expiresAt: { $gt: new Date() }
                });

                if (!storedToken) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid or expired refresh token'
                    });
                }

                // Get user
                const user = await User.findById(decodedAccess.userId);
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'User not found'
                    });
                }

                // Generate new tokens
                const accessToken = jwt.sign(
                    { 
                        userId: user._id,
                        email: user.email,
                        roles: user.roles 
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '15m' }
                );

                const newRefreshToken = jwt.sign(
                    { userId: user._id },
                    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                // Update refresh token in database
                await Token.findByIdAndUpdate(storedToken._id, {
                    token: newRefreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                });

                return res.json({
                    success: true,
                    token: accessToken,
                    refreshToken: newRefreshToken
                });

            } catch (verifyError) {
                console.error('Token verification failed:', verifyError);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid tokens'
                });
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            return res.status(401).json({
                success: false,
                message: 'Token refresh failed'
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
                decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (!decoded.userId) {
                    throw new Error('Invalid token structure');
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired verification token'
                });
            }

            // Find the user
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Find the verification token in database
            const verificationToken = await Token.findOne({
                userId: decoded.userId,
                token: token,
                type: 'verification'
            });

            if (!verificationToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Verification token not found or already used'
                });
            }

            // Check if token is expired
            if (verificationToken.expiresAt < new Date()) {
                await Token.deleteOne({ _id: verificationToken._id });
                return res.status(400).json({
                    success: false,
                    message: 'Verification token has expired'
                });
            }

            // Update user and remove token
            user.isVerified = true;
            await user.save();
            await Token.deleteOne({ _id: verificationToken._id });

            // Send welcome email after successful verification
            try {
                await authService.sendWelcomeEmail(user);
            } catch (emailError) {
                console.error('Welcome email error:', emailError);
                // Don't fail verification if welcome email fails
            }

            res.json({
                success: true,
                message: 'Email verified successfully'
            });
        } catch (error) {
            console.error('Email verification error:', error);
            res.status(500).json({
                success: false,
                message: 'Email verification failed'
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
            if (!req.user) {
                throw new Error('Authentication failed');
            }

            const { token } = req.user;
            
            // Redirect to social callback handler
            res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${token}`);
        } catch (error) {
            console.error('GitHub callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }

    async handleSocialAuthCallback(req, res) {
        try {
            if (!req.user) {
                throw new Error('Authentication failed');
            }

            const { user, token } = req.user;
            
            // Ensure token is prefixed with Bearer
            const tokenWithBearer = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            
            // Redirect to social callback handler with token
            res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${tokenWithBearer}`);
        } catch (error) {
            console.error('Social auth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
        }
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