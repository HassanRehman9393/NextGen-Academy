const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middleware/authMiddleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const TokenUtils = require('../utils/tokenUtils');

// Create an instance of AuthController
const authController = new AuthController();

// Registration
router.post('/register',
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validateRegistration,
    (req, res) => authController.register(req, res)
);

// Login
router.post('/login',
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validateLogin,
    (req, res) => authController.login(req, res)
);

// Logout
router.post('/logout',
    AuthMiddleware.authenticateToken,
    (req, res) => authController.logout(req, res)
);

// Email verification
router.get('/verify-email/:token', (req, res) => authController.verifyEmail(req, res));

// Password reset
router.post('/forgot-password',
    ValidationMiddleware.sanitizeInput,
    (req, res) => authController.requestPasswordReset(req, res)
);

router.post('/reset-password/:token',
    ValidationMiddleware.sanitizeInput,
    ValidationMiddleware.validatePasswordReset,
    (req, res) => authController.resetPassword(req, res)
);

// Social authentication routes
// Google authentication
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login', 
        session: false 
    }),
    (req, res) => {
        const token = req.user?.token;
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    }
);

// Facebook authentication
router.get('/facebook', passport.authenticate('facebook', { 
    scope: ['email'] 
}));

router.get('/facebook/callback',
    passport.authenticate('facebook', { 
        failureRedirect: '/login', 
        session: false 
    }),
    (req, res) => authController.facebookCallback(req, res)
);

// GitHub authentication
router.get('/github', passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
}));

router.get('/github/callback',
    passport.authenticate('github', { 
        session: false, 
        failureRedirect: '/login' 
    }),
    (req, res) => authController.githubCallback(req, res)
);

// Token refresh
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

module.exports = router; 