import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForumContext } from '../context/ForumContext';
import { formatTimestamp } from '../utils/formatUtils';
import ReplyForm from './ReplyForm';
import forumService from '../services/forumService';
import { FaArrowLeft, FaSpinner, FaUser, FaClock, FaReply, FaComments } from 'react-icons/fa';

const Comment = ({ comment, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    if (!comment || !comment.studentId) {
        return null;
    }

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 md:p-6 border border-white/10">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <FaUser className="text-white" />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h4 className="text-white font-semibold">
                            {comment.studentId?.firstName} {comment.studentId?.lastName}
                        </h4>
                        <span className="text-white/60 text-sm flex items-center">
                            <FaClock className="mr-2 text-yellow-400" />
                            {formatTimestamp(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-white/80 mt-2">{comment.content}</p>
                    
                    {/* Replies Section */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {comment.replies.map((reply, index) => (
                                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-semibold">
                                            {reply.authorId?.firstName} {reply.authorId?.lastName}
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
                            <FaReply className="mr-2" />
                            Reply to comment
                        </button>
                        {showReplyForm && (
                            <div className="mt-3">
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
        </div>
    );
};

const ForumDetails = () => {
    const { forumId } = useParams();
    const navigate = useNavigate();
    const { currentForum, setCurrentForum, addReply } = useForumContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');

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

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const response = await forumService.addComment(forumId, { content: commentText });
            if (response.success) {
                const updatedForum = await forumService.getForumDetails(forumId);
                setCurrentForum(updatedForum.data);
                setCommentText('');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err.message);
        }
    };

    const handleReply = async (commentId, content) => {
        try {
            const response = await addReply(forumId, commentId, { content });
            if (response.success) {
                // Refresh the forum details
                const updatedForum = await forumService.getForumDetails(forumId);
                setCurrentForum(updatedForum.data);
            }
        } catch (err) {
            console.error('Error adding reply:', err);
            setError(err.message);
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

                {/* Add Comment Section */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Add a Comment</h3>
                    <form onSubmit={handleAddComment}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-300/50 min-h-[120px] resize-none"
                            placeholder="Share your thoughts..."
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition-all duration-200"
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Comments Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Comments ({currentForum.comments?.length || 0})
                    </h2>
                    {currentForum.comments?.length > 0 ? (
                        currentForum.comments.map((comment) => (
                            <Comment
                                key={comment._id}
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