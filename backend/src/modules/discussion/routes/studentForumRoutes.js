const express = require('express');
const router = express.Router();
const studentForumController = require('../controllers/studentForumController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireStudent } = require('../../auth/middleware/roleMiddleware');

// Apply authentication and student role middleware
router.use(authenticateToken, requireStudent);

// Student forum routes
router.get('/forums', studentForumController.getAllForums);
router.get('/forums/:forumId', studentForumController.getForumDetails);
router.post('/forums/:forumId/comments', studentForumController.addComment);
router.get('/courses/:courseId/forums', studentForumController.getForumsByCourse);

module.exports = router; 