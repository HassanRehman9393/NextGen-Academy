import React, { createContext, useContext, useState, useCallback } from 'react';
import chatService from '../services/chatService';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createChat = async (message) => {
        try {
            setLoading(true);
            const response = await chatService.createChat(message);
            if (response.success) {
                setChats(prev => [response.data, ...prev]);
                setCurrentChat(response.data);
            }
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (chatId, message) => {
        try {
            setLoading(true);
            const response = await chatService.sendMessage(chatId, message);
            if (response.success) {
                setCurrentChat(response.data);
            }
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchChats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await chatService.getChats();
            if (response.success) {
                setChats(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchChatById = async (chatId) => {
        try {
            setLoading(true);
            const response = await chatService.getChatById(chatId);
            if (response.success) {
                setCurrentChat(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteChat = async (chatId) => {
        try {
            setLoading(true);
            await chatService.deleteChat(chatId);
            setChats(prev => prev.filter(chat => chat._id !== chatId));
            if (currentChat?._id === chatId) {
                setCurrentChat(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        chats,
        currentChat,
        loading,
        error,
        createChat,
        sendMessage,
        fetchChats,
        fetchChatById,
        deleteChat,
        setCurrentChat
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContext;