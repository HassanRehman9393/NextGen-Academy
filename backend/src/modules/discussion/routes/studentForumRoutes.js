const express = require('express');
const router = express.Router();
const studentForumController = require('../controllers/studentForumController');
const { requireStudent } = require('../../auth/middleware/roleMiddleware');

// Student forum routes
router.get('/', requireStudent, studentForumController.getAllForums);
router.get('/:forumId', requireStudent, studentForumController.getForumDetails);
router.post('/:forumId/comments', requireStudent, studentForumController.addComment);
router.get('/courses/:courseId', requireStudent, studentForumController.getForumsByCourse);

module.exports = router; 