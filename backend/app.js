const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const connectDB = require('./src/config/database');
const cors = require('cors');
require('dotenv').config();
const { quizRoutes } = require('./src/modules/quizzes');
const { authenticateToken } = require('./src/middleware/authMiddleware');

// Import routes
const authRouter = require('./src/modules/auth/routes/authRoutes');
const videoRouter = require('./src/modules/videos/routes/videoRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Middleware
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
app.use(passport.initialize());

// Protected routes
const protectedRoutes = ['/api/videos', '/api/quizzes'];

// Apply authentication to protected routes
protectedRoutes.forEach(route => {
    app.use(route, authenticateToken);
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/videos', videoRouter);
app.use('/api/quizzes', quizRoutes);

// Handle 404s
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Port configuration
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
