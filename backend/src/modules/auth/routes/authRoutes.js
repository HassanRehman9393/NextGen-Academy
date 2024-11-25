const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middleware/authMiddleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const TokenUtils = require('../utils/tokenUtils');

// Registration
router.post('/register',
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validateRegistration,
    AuthController.register
);

// Login
router.post('/login',
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validateLogin,
    AuthController.login
);

// Logout
router.post('/logout',
    AuthMiddleware.authenticateToken,
    AuthController.logout
);

// Email verification
router.get('/verify-email/:token', AuthController.verifyEmail);

// Password reset
router.post('/forgot-password',
    ValidationMiddleware.sanitizeInput,
    AuthController.requestPasswordReset
);

router.post('/reset-password/:token',
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validatePasswordReset,
    AuthController.resetPassword
);

// Social authentication routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false 
    }),
    (req, res) => {
        // After successful authentication, redirect to frontend
        const token = req.user.token;
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    }
);

router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    AuthController.facebookCallback
);

router.get('/github', (req, res, next) => {
    console.log('Starting GitHub auth...', {
        clientID: process.env.GITHUB_CLIENT_ID,
        callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`
    });
    passport.authenticate('github', { 
        scope: ['user:email'],
        session: false 
    })(req, res, next);
});

router.get('/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // Redirect to frontend dashboard with token
        const token = req.user.token;
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    }
);

// Protected routes
router.get('/profile',
    AuthMiddleware.authenticateToken,
    AuthMiddleware.requireVerifiedEmail,
    (req, res) => {
        res.json({ user: req.user });
    }
);

router.patch('/profile',
    AuthMiddleware.authenticateToken,
    AuthMiddleware.requireVerifiedEmail,
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validateProfileUpdate,
    async (req, res) => {
        try {
            const updatedUser = await AuthController.updateProfile(req, res);
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    }
);

// Token management
router.post('/refresh-token',
    ValidationMiddleware.sanitizeInput,
    async (req, res) => {
        try {
            const result = await AuthController.refreshToken(req, res);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error refreshing token', error: error.message });
        }
    }
);

// Admin routes
router.get('/users',
    AuthMiddleware.authenticateToken,
    AuthMiddleware.requireAdmin,
    async (req, res) => {
        try {
            const users = await AuthController.getAllUsers(req, res);
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }
);

// Course management routes
router.post('/courses',
    AuthMiddleware.authenticateToken,
    AuthMiddleware.requireInstructor,
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validateCourse,
    async (req, res) => {
        try {
            const course = await AuthController.createCourse(req, res);
            res.json(course);
        } catch (error) {
            res.status(500).json({ message: 'Error creating course', error: error.message });
        }
    }
);

module.exports = router; 