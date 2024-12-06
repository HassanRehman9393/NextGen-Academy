const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireStudent } = require('../../auth/middleware/roleMiddleware');
const { validateEnrollmentRequest, validateProgressUpdate } = require('../middleware/enrollmentValidation');

// Apply middleware
router.use(authenticateToken);
router.use(requireStudent);

// Enrollment routes
router.post('/courses/:courseId/enroll', validateEnrollmentRequest, enrollmentController.enrollInCourse);
router.post('/courses/:courseId/content/:contentId/progress', validateProgressUpdate, enrollmentController.updateProgress);
router.get('/courses/:courseId/enrollment', enrollmentController.getEnrollmentStatus);
router.get('/enrollments', enrollmentController.getStudentEnrollments);

module.exports = router; 