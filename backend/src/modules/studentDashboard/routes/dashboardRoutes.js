const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Course routes
router.get('/courses', DashboardController.getCourses);
router.get('/courses/:id', DashboardController.getCourseById);

// Video routes
router.get('/videos', DashboardController.getVideos);
router.get('/videos/:id', DashboardController.getVideoById);

module.exports = router;