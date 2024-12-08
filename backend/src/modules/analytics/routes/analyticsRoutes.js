const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireInstructor } = require('../../auth/middleware/roleMiddleware');

// Apply middleware
router.use(authenticateToken);
router.use(requireInstructor);

// Analytics routes
router.get('/course/:courseId', analyticsController.getCourseAnalytics);
router.get('/course/:courseId/pdf', analyticsController.downloadPDFReport);
router.get('/course/:courseId/excel', analyticsController.downloadExcelReport);

// Add the PUT route for updating analytics
router.put('/course/:courseId', analyticsController.updateAnalytics);

module.exports = router; 