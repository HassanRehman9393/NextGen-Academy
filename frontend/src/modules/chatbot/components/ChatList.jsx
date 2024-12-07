import React from 'react';
import { FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const ChatList = ({ chats, currentChat, onSelectChat, onDeleteChat }) => {
    return (
        <div className="overflow-y-auto">
            {chats.map(chat => (
                <div
                    key={chat._id}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between ${
                        currentChat?._id === chat._id ? 'bg-white/10' : ''
                    }`}
                    onClick={() => onSelectChat(chat._id)}
                >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FiMessageSquare className="text-yellow-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white truncate">{chat.title}</h3>
                            <p className="text-white/60 text-sm">
                                {formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat._id);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-400 transition-colors"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ChatList; 