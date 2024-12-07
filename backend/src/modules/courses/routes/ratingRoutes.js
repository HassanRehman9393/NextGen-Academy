const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireStudent } = require('../../auth/middleware/roleMiddleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Public routes (only need authentication)
router.get('/course/:courseId', ratingController.getCourseRatings);

// Student-only routes
router.get('/course/:courseId/student', requireStudent, ratingController.getStudentRating);
router.post('/course/:courseId', requireStudent, ratingController.addRating);
router.put('/:ratingId', requireStudent, ratingController.updateRating);
router.delete('/:ratingId', requireStudent, ratingController.deleteRating);

module.exports = router; 