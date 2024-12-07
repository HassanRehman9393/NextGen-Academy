const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/chatModel');

class ChatbotService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        this.requestQueue = [];
        this.isProcessing = false;
        this.retryDelay = 1000; // 1 second delay between retries
        this.maxRetries = 3;
    }

    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) return;

        this.isProcessing = true;
        const { resolve, reject, message, retryCount = 0 } = this.requestQueue.shift();

        try {
            const result = await this.model.generateContent(message);
            const aiResponse = result.response.text();
            resolve(aiResponse);
        } catch (error) {
            if (error.status === 429 && retryCount < this.maxRetries) {
                // Rate limit hit - add back to queue with increased retry count
                console.log(`Rate limit hit, retrying in ${this.retryDelay}ms...`);
                this.requestQueue.unshift({ resolve, reject, message, retryCount: retryCount + 1 });
                await new Promise(r => setTimeout(r, this.retryDelay));
            } else {
                reject(error);
            }
        } finally {
            this.isProcessing = false;
            if (this.requestQueue.length > 0) {
                setTimeout(() => this.processQueue(), this.retryDelay);
            }
        }
    }

    async getAIResponse(message) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ resolve, reject, message });
            this.processQueue();
        });
    }

    async createChat(studentId, initialMessage) {
        try {
            // Get AI response with retry mechanism
            const aiResponse = await this.getAIResponse(initialMessage);

            // Create new chat with initial messages
            const chat = new Chat({
                student: studentId,
                title: this.generateChatTitle(initialMessage),
                messages: [
                    {
                        content: initialMessage,
                        role: 'user'
                    },
                    {
                        content: aiResponse,
                        role: 'assistant'
                    }
                ]
            });

            await chat.save();
            return chat;
        } catch (error) {
            console.error('Error creating chat:', error);
            if (error.status === 429) {
                throw new Error('Service is currently busy. Please try again in a few moments.');
            }
            throw error;
        }
    }

    async sendMessage(chatId, studentId, message) {
        try {
            const chat = await Chat.findOne({ _id: chatId, student: studentId });
            if (!chat) {
                throw new Error('Chat not found');
            }

            // Get AI response with retry mechanism
            const aiResponse = await this.getAIResponse(message);

            // Add both messages to chat
            chat.messages.push(
                {
                    content: message,
                    role: 'user'
                },
                {
                    content: aiResponse,
                    role: 'assistant'
                }
            );

            await chat.save();
            return chat;
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.status === 429) {
                throw new Error('Service is currently busy. Please try again in a few moments.');
            }
            throw error;
        }
    }

    async getChats(studentId) {
        try {
            return await Chat.find({ student: studentId })
                .sort({ lastMessageAt: -1 })
                .select('title lastMessageAt');
        } catch (error) {
            console.error('Error getting chats:', error);
            throw error;
        }
    }

    async getChatById(chatId, studentId) {
        try {
            return await Chat.findOne({ _id: chatId, student: studentId });
        } catch (error) {
            console.error('Error getting chat:', error);
            throw error;
        }
    }

    async deleteChat(chatId, studentId) {
        try {
            return await Chat.findOneAndDelete({ _id: chatId, student: studentId });
        } catch (error) {
            console.error('Error deleting chat:', error);
            throw error;
        }
    }

    generateChatTitle(message) {
        // Generate a title from the first message (limit to 50 characters)
        return message.length > 50 ? `${message.substring(0, 47)}...` : message;
    }
}

module.exports = new ChatbotService(); 