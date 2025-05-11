const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const connectDB = require('./src/config/database');
const cors = require('cors');
require('dotenv').config();
const { authenticateToken } = require('./src/modules/auth/middleware/authMiddleware');
const { requireStudent } = require('./src/modules/auth/middleware/roleMiddleware');

// Import routes
const authRouter = require('./src/modules/auth/routes/authRoutes');
const videoRouter = require('./src/modules/videos/routes/videoRoutes');
const courseRouter = require('./src/modules/courses/routes/courseRoutes');
const dashboardRouter = require('./src/modules/studentDashboard/routes/dashboardRoutes');
const { quizRoutes } = require('./src/modules/quizzes');
const forumRouter = require('./src/modules/discussion/routes/forumRoutes');
const studentForumRouter = require('./src/modules/discussion/routes/studentForumRoutes');
const enrollmentRoutes = require('./src/modules/courses/routes/enrollmentRoutes');
const chatbotRoutes = require('./src/modules/chatbot/routes/chatbotRoutes');
const ratingRoutes = require('./src/modules/courses/routes/ratingRoutes');
const analyticsRoutes = require('./src/modules/analytics/routes/analyticsRoutes');
const ratingManagementRoutes = require('./src/modules/ratings/routes/ratingManagementRoutes');

// Connect to MongoDB
connectDB();

const app = express();


// CORS configuration

// CORS configuration - using a more permissive configuration for development
app.use(cors({
    origin: true, // Allow all origins for development, change to specific origins in production

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Add this before your routes
app.options('*', cors());  // Enable pre-flight for all routes

// Middleware
app.use(logger('dev'));
app.use(express.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        try {
            if (buf.length) {
                JSON.parse(buf);
            }
        } catch (e) {
            res.status(400).json({ 
                success: false, 
                message: 'Invalid JSON payload' 
            });

            throw Error('Invalid JSON');

            // Don't throw error here, as it prevents the response from being sent properly
            req.invalidJSON = true; // Mark the request as invalid
        }
    }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRouter);

// Protected routes with authentication
app.use('/api/discussion/student', authenticateToken, studentForumRouter);
app.use('/api/discussion', forumRouter);
app.use('/api/videos', authenticateToken, videoRouter);
app.use('/api/quizzes', authenticateToken, quizRoutes);
app.use('/api/courses', authenticateToken, courseRouter);
app.use('/api/dashboard', authenticateToken, dashboardRouter);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/instructor/ratings', ratingManagementRoutes);

// Add this before your routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Handle 404s
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
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

// Add error handler for JSON parsing
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid JSON payload' 
        });
    }
    next();
});


// Add middleware to check for invalidJSON flag
app.use((req, res, next) => {
    if (req.invalidJSON === true) {
        return; // Response was already sent in the verify function
    }
    next();
});


// Port configuration
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
