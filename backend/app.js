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

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['new-token']
}));

// Middleware
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
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
