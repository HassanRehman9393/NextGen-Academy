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
            <div className="flex h-[calc(100vh-80px)] bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 mx-2 my-2 sm:m-4">
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden absolute top-4 left-4 z-50 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg text-white hover:scale-105 transition-all duration-300"
                >
                    {showSidebar ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                </button>

                <aside 
                    className={`
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        fixed lg:relative inset-y-0 left-0 z-40 w-full max-w-[320px] lg:w-80 
                        bg-black/30 backdrop-blur-xl border-r border-white/10 
                        transition-transform duration-300 ease-in-out
                    `}
                >
                    <div className="flex flex-col h-full">
                        <div className="p-4 lg:pt-4 pt-16 border-b border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                                    <FiMessageSquare className="text-xl text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-white">NextGen AI</h2>
                            </div>
                            <button
                                onClick={() => {
                                    createChat('Hi, I need help!');
                                    setShowSidebar(false);
                                }}
                                className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                            >
                                <FiPlus /> New Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <ChatList
                                chats={chats}
                                currentChat={currentChat}
                                onSelectChat={(id) => {
                                    fetchChatById(id);
                                    setShowSidebar(false);
                                }}
                                onDeleteChat={deleteChat}
                            />
                        </div>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col">
                    <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                    >
                        {!currentChat ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl mb-6">
                                    <FiMessageSquare className="text-3xl sm:text-4xl text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Welcome to NextGen AI</h2>
                                <p className="text-white/60 max-w-md mb-6 text-sm sm:text-base">
                                    Your intelligent learning assistant. Start a new chat or select an existing conversation.
                                </p>
                                <button
                                    onClick={() => createChat('Hi, I need help!')}
                                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 flex items-center gap-2 transition-all duration-300 shadow-lg"
                                >
                                    <FiPlus /> Start New Chat
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

                    <div className="p-4 border-t border-white/10">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-yellow-400/50 transition-all duration-300 text-sm sm:text-base"
                            />
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 flex items-center gap-2 transition-all duration-300"
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin" />
                                ) : (
                                    <>
                                        <FiSend />
                                        <span className="hidden sm:inline">Send</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </StudentLayout>
    );
};

export default Chatbot;