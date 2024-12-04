import React from 'react';
import { formatTimestamp } from '../utils/formatUtils';

const CommentCard = ({ comment }) => {
    return (
        <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {comment.studentId.firstName[0]}
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">
                                {comment.studentId.firstName} {comment.studentId.lastName}
                            </h4>
                            <span className="text-sm text-gray-500">
                                {formatTimestamp(comment.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                    
                    {/* Replies Section */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2">
                            {comment.replies.map((reply, index) => (
                                <div key={index} className="mb-2">
                                    <div className="flex items-start gap-2">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                                            {reply.authorId.firstName[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {reply.authorId.firstName} {reply.authorId.lastName}
                                            </div>
                                            <p className="text-sm text-gray-700">{reply.content}</p>
                                            <span className="text-xs text-gray-500">
                                                {formatTimestamp(reply.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentCard; 