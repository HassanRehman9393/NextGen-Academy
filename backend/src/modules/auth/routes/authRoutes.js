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
// Google authentication route
router.get('/google', (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const token = req.user?.token;
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    }
);

// Facebook authentication route
router.get('/facebook', (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
    AuthController.facebookCallback
);


router.get('/github', (req, res, next) => {
    console.log('Starting GitHub auth...', {
        clientID: process.env.GITHUB_CLIENT_ID,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`
    });
    passport.authenticate('github', { 
        scope: ['user:email'],
        session: false 
    })(req, res, next);
});

router.get('/github/callback',
    passport.authenticate('github', { 
        session: false, 
        failureRedirect: '/login' 
    }),
    (req, res) => {
        try {
            const token = req.user.token;
            res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
        } catch (error) {
            console.error('GitHub callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
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


module.exports = router; 