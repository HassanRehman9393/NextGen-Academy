import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChatProvider } from '../context/ChatContext';
import Chatbot from '../components/Chatbot';

const ChatbotRoutes = () => {
    return (
        <ChatProvider>
            <Routes>
                <Route index element={<Chatbot />} />
            </Routes>
        </ChatProvider>
    );
};

export default ChatbotRoutes; 