var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const connectDB = require('./src/config/database');
const cors = require('cors');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Import routes
const authRouter = require('./src/modules/auth/routes/authRoutes');

var app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRouter);

// Handle 404s
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Port configuration
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
