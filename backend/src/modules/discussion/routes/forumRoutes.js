const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireInstructor } = require('../../auth/middleware/roleMiddleware');

// Apply authentication and instructor role middleware to all routes
router.use(authenticateToken, requireInstructor);

// Forum routes
router.get('/my-forums', forumController.getForumsByInstructor);
router.post('/create', forumController.createForum);
router.get('/:forumId', forumController.getForumDetails);
router.post('/:forumId/comments', forumController.addComment);
router.post('/:forumId/comments/:commentId/reply', forumController.addReply);
router.put('/:forumId', forumController.updateForum);
router.delete('/:forumId', forumController.deleteForum);

module.exports = router; 