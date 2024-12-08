const express = require('express');
const router = express.Router();
const ratingManagementController = require('../controllers/ratingManagementController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireInstructor } = require('../../auth/middleware/roleMiddleware');
const { validateResponse } = require('../middleware/ratingValidation');

// Apply middleware
router.use(authenticateToken);
router.use(requireInstructor);

// Rating management routes
router.get('/course/:courseId/ratings', ratingManagementController.getCourseRatings);
router.post('/ratings/:ratingId/respond', validateResponse, ratingManagementController.respondToRating);
router.delete('/responses/:responseId', ratingManagementController.deleteResponse);
router.get('/course/:courseId/rating-analytics', ratingManagementController.getRatingAnalytics);

module.exports = router; 