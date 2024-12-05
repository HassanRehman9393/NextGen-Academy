import React, { useState } from 'react';
import { formatTimestamp } from '../utils/formatUtils';
import { FaUser, FaClock, FaReply } from 'react-icons/fa';
import ReplyForm from './ReplyForm';

const CommentCard = ({ comment, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            {/* Main Comment */}
            <div className="p-4 md:p-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                            <FaUser className="text-sm md:text-base text-white" />
                        </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                            <h4 className="text-sm md:text-base font-semibold text-white truncate">
                                {comment.studentId.firstName} {comment.studentId.lastName}
                            </h4>
                            <span className="text-xs md:text-sm text-white/60 flex items-center">
                                <FaClock className="mr-2 text-yellow-400" />
                                {formatTimestamp(comment.createdAt)}
                            </span>
                        </div>
                        <p className="text-sm md:text-base text-white/80 mt-2">{comment.content}</p>

                        {/* Reply Button */}
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="mt-3 md:mt-4 text-yellow-300 hover:text-yellow-200 flex items-center text-xs md:text-sm transition-colors"
                        >
                            <FaReply className="mr-2" />
                            Reply
                        </button>

                        {/* Reply Form */}
                        {showReplyForm && (
                            <div className="mt-4">
                                <ReplyForm
                                    onSubmit={async (content) => {
                                        await onReply(comment._id, content);
                                        setShowReplyForm(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="bg-black/20 border-t border-white/5">
                    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                        {comment.replies.map((reply) => (
                            <div key={reply._id} className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-white/5 rounded-lg">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-yellow-400/80 to-orange-500/80 flex items-center justify-center">
                                        <FaUser className="text-xs md:text-sm text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                                        <span className="text-xs md:text-sm font-medium text-white/90 truncate">
                                            {reply.authorId.firstName} {reply.authorId.lastName}
                                        </span>
                                        <span className="text-xs text-white/50 flex items-center">
                                            <FaClock className="mr-1 text-yellow-400/80" />
                                            {formatTimestamp(reply.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs md:text-sm text-white/70 mt-1">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentCard; 