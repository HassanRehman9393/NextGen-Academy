const chatbotService = require('../services/chatbotService');

class ChatbotController {
    async createChat(req, res) {
        try {
            const { message } = req.body;
            
            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: 'Message is required'
                });
            }

            const chat = await chatbotService.createChat(req.user._id, message);
            
            res.status(201).json({
                success: true,
                data: chat
            });
        } catch (error) {
            console.error('Create chat error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async sendMessage(req, res) {
        try {
            const { chatId } = req.params;
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: 'Message is required'
                });
            }

            const chat = await chatbotService.sendMessage(chatId, req.user._id, message);
            
            res.json({
                success: true,
                data: chat
            });
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getChats(req, res) {
        try {
            const chats = await chatbotService.getChats(req.user._id);
            
            res.json({
                success: true,
                data: chats
            });
        } catch (error) {
            console.error('Get chats error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getChatById(req, res) {
        try {
            const chat = await chatbotService.getChatById(req.params.chatId, req.user._id);
            
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found'
                });
            }

            res.json({
                success: true,
                data: chat
            });
        } catch (error) {
            console.error('Get chat error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteChat(req, res) {
        try {
            const chat = await chatbotService.deleteChat(req.params.chatId, req.user._id);
            
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: 'Chat not found'
                });
            }

            res.json({
                success: true,
                message: 'Chat deleted successfully'
            });
        } catch (error) {
            console.error('Delete chat error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new ChatbotController();