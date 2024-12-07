import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { FiSend, FiPlus, FiTrash2, FiLoader, FiMenu, FiX, FiMessageSquare, FiCpu } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import ChatList from './ChatList';
import StudentLayout from '../../studentDashboard/components/StudentLayout';

const MessageBubble = ({ message, role }) => (
    <div className={`flex items-start gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <FiCpu className="text-white" />
            </div>
        )}
        <div
            className={`
                group relative max-w-[80%] p-4 rounded-2xl transition-all duration-300
                ${role === 'user'
                    ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 text-white ml-auto rounded-tr-none hover:from-yellow-400/30 hover:to-orange-500/30'
                    : 'bg-white/10 text-white rounded-tl-none hover:bg-white/[0.15]'
                }
                shadow-lg backdrop-blur-sm border border-white/10
            `}
        >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <span className="text-xs text-white/40 mt-2 block">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
            <div className={`absolute top-0 ${role === 'user' ? '-right-2' : '-left-2'} w-4 h-4 transform ${role === 'user' ? 'rotate-45' : '-rotate-45'} ${role === 'user' ? 'bg-yellow-400/20' : 'bg-white/10'}`} />
        </div>
        {role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-sm font-semibold">
                    {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).firstName[0] : 'U'}
                </span>
            </div>
        )}
    </div>
);

const Chatbot = () => {
    const {
        chats,
        currentChat,
        loading,
        error,
        createChat,
        sendMessage,
        fetchChats,
        fetchChatById,
        deleteChat
    } = useChat();

    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            if (!currentChat) {
                await createChat(message);
            } else {
                await sendMessage(currentChat._id, message);
            }
            setMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <StudentLayout>
            <div className="flex h-[calc(100vh-80px)] bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 m-4">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg text-white transform hover:scale-110 transition-all duration-300"
                >
                    {showSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                {/* Chat List Sidebar */}
                <div 
                    className={`
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        fixed lg:static inset-y-0 left-0 z-40 w-80 border-r border-white/10 
                        transition-transform duration-300 ease-in-out
                    `}
                >
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                <FiMessageSquare className="text-2xl text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">NextGen AI</h2>
                        </div>
                        <button
                            onClick={() => createChat('Hi, I need help!')}
                            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <FiPlus className="text-lg" /> New Chat
                        </button>
                    </div>
                    <ChatList
                        chats={chats}
                        currentChat={currentChat}
                        onSelectChat={fetchChatById}
                        onDeleteChat={deleteChat}
                    />
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col lg:border-l-0">
                    {/* Welcome Screen or Chat Messages */}
                    <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    >
                        {!currentChat ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl mb-8">
                                    <FiMessageSquare className="text-5xl text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Welcome to NextGen AI</h2>
                                <p className="text-white/60 max-w-md mb-8 text-lg">
                                    Your intelligent learning assistant. Start a new chat or select an existing conversation to begin.
                                </p>
                                <button
                                    onClick={() => createChat('Hi, I need help!')}
                                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                                >
                                    <FiPlus className="text-xl" /> Start New Chat
                                </button>
                            </div>
                        ) : (
                            <>
                                {currentChat.messages.map((msg, index) => (
                                    <MessageBubble
                                        key={index}
                                        message={msg}
                                        role={msg.role}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/10">
                        <form onSubmit={handleSubmit} className="flex gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400/50 transition-all duration-300 shadow-lg"
                            />
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin text-xl" />
                                ) : (
                                    <>
                                        <FiSend className="text-xl" />
                                        <span className="hidden sm:inline">Send</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default Chatbot;