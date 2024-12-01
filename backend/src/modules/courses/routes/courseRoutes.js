const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireInstructor } = require('../../auth/middleware/roleMiddleware');

// Apply authentication and instructor role middleware
router.use(authenticateToken);
router.use(requireInstructor);

// Course CRUD routes
router.post('/', CourseController.createCourse);
router.get('/', CourseController.getCourses);
router.get('/:id', CourseController.getCourseById);
router.put('/:id', CourseController.updateCourse);
router.delete('/:id', CourseController.deleteCourse);

// Content management routes
router.post('/:courseId/content', CourseController.addContent);
router.delete('/:courseId/content/:contentIndex', CourseController.removeContent);
router.put('/:courseId/content/reorder', CourseController.reorderContent);

module.exports = router; 