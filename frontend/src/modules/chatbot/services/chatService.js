import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class ChatService {
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            'Authorization': token,
            'Content-Type': 'application/json'
        };
    }

    async createChat(message) {
        try {
            const response = await axios.post(
                `${API_URL}/chatbot/chats`,
                { message },
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create chat');
        }
    }

    async sendMessage(chatId, message) {
        try {
            const response = await axios.post(
                `${API_URL}/chatbot/chats/${chatId}/messages`,
                { message },
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    }

    async getChats() {
        try {
            const response = await axios.get(
                `${API_URL}/chatbot/chats`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch chats');
        }
    }

    async getChatById(chatId) {
        try {
            const response = await axios.get(
                `${API_URL}/chatbot/chats/${chatId}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch chat');
        }
    }

    async deleteChat(chatId) {
        try {
            const response = await axios.delete(
                `${API_URL}/chatbot/chats/${chatId}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete chat');
        }
    }
}

export default new ChatService(); 