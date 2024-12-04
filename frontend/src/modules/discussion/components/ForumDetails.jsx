import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForumContext } from '../context/ForumContext';
import { formatTimestamp } from '../utils/formatUtils';
import ReplyForm from './ReplyForm';
import forumService from '../services/forumService';
import { FaArrowLeft, FaSpinner, FaUser, FaClock, FaReply } from 'react-icons/fa';

const Comment = ({ comment, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <FaUser className="text-white" />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h4 className="text-white font-semibold">
                            {comment.student.name}
                        </h4>
                        <span className="text-white/60 text-sm flex items-center">
                            <FaClock className="mr-1" />
                            {formatTimestamp(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-white/80 mt-2">{comment.content}</p>
                    
                    {/* Replies */}
                    {comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-semibold">
                                            {reply.author.name}
                                        </span>
                                        <span className="text-white/60 text-sm">
                                            {formatTimestamp(reply.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-white/80 mt-1">{reply.content}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reply Button & Form */}
                    <div className="mt-4">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-yellow-300 hover:text-yellow-200 flex items-center text-sm"
                        >
                            <FaReply className="mr-1" />
                            Reply to comment
                        </button>
                        {showReplyForm && (
                            <div className="mt-3">
                                <ReplyForm
                                    onSubmit={async (content) => {
                                        await onReply(comment.id, content);
                                        setShowReplyForm(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ForumDetails = () => {
    const { forumId } = useParams();
    const navigate = useNavigate();
    const { currentForum, setCurrentForum, addReply } = useForumContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForumDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await forumService.getForumDetails(forumId);
                if (response.data) {
                    setCurrentForum(response.data);
                } else {
                    throw new Error('No data received from server');
                }
            } catch (err) {
                console.error('Error fetching forum details:', err);
                setError(err.message || 'Failed to load forum details');
            } finally {
                setLoading(false);
            }
        };

        if (forumId) {
            fetchForumDetails();
        }
    }, [forumId, setCurrentForum]);

    const handleReply = async (commentId, content) => {
        try {
            setError(null);
            await addReply(forumId, commentId, { content });
        } catch (err) {
            console.error('Error adding reply:', err);
            setError(err.message || 'Failed to add reply');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center">
                <FaSpinner className="text-4xl text-white animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center">
                <div className="text-white text-center">
                    <p className="text-xl">Error: {error}</p>
                    <button
                        onClick={() => navigate('/instructor/forums')}
                        className="mt-4 text-yellow-300 hover:text-yellow-200"
                    >
                        Return to Forums
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/instructor/forums')}
                        className="flex items-center text-white/80 hover:text-white mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Forums
                    </button>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {currentForum.title}
                        </h1>
                        <div className="text-white/60 mb-4">
                            <span className="mr-4">Topic: {currentForum.topic}</span>
                            <span>Created {formatTimestamp(currentForum.createdAt)}</span>
                        </div>
                        <p className="text-white/80">{currentForum.description}</p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Comments ({currentForum.comments?.length || 0})
                    </h2>
                    {currentForum.comments?.length > 0 ? (
                        currentForum.comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                onReply={handleReply}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-white/60">
                            No comments yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForumDetails; 