const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Course routes
router.get('/courses/all', DashboardController.getAllCourses);
router.get('/courses/search', DashboardController.searchCourses);
router.get('/courses/:id', DashboardController.getCourseById);

// Video routes
router.get('/videos/all', DashboardController.getAllVideos);
router.get('/videos/search', DashboardController.searchVideos);
router.get('/videos/:id', DashboardController.getVideoById);

module.exports = router;