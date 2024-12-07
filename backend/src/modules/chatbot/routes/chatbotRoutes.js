const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { authenticateToken } = require('../../auth/middleware/authMiddleware');
const { requireStudent } = require('../../auth/middleware/roleMiddleware');
const { chatbotLimiter } = require('../middleware/rateLimitMiddleware');

// Apply middleware
router.use(authenticateToken);
router.use(requireStudent);
router.use(chatbotLimiter);  // Add rate limiting

// Chat routes
router.post('/chats', chatbotController.createChat);
router.post('/chats/:chatId/messages', chatbotController.sendMessage);
router.get('/chats', chatbotController.getChats);
router.get('/chats/:chatId', chatbotController.getChatById);
router.delete('/chats/:chatId', chatbotController.deleteChat);

module.exports = router; 