import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentForum } from '../context/StudentForumContext';
import { formatTimestamp } from '../utils/formatUtils';
import CommentCard from './CommentCard';
import { FaArrowLeft, FaSpinner, FaBook, FaUser, FaClock, FaComments } from 'react-icons/fa';
import StudentLayout from '../../studentDashboard/components/StudentLayout';

const ForumDetailsStudent = () => {
    const { forumId } = useParams();
    const navigate = useNavigate();
    const { selectedForum, loading, error, fetchForumDetails, addComment } = useStudentForum();
    const [commentText, setCommentText] = useState('');
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (forumId) {
            fetchForumDetails(forumId);
        }
    }, [forumId, fetchForumDetails]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!commentText.trim()) {
            setSubmitError('Comment cannot be empty');
            return;
        }

        try {
            await addComment(forumId, commentText);
            setCommentText('');
        } catch (error) {
            setSubmitError(error.message);
        }
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <FaSpinner className="text-4xl text-yellow-400 animate-spin" />
                </div>
            </StudentLayout>
        );
    }

    if (error) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center text-white">
                        <p className="text-xl mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/dashboard/forums')}
                            className="text-yellow-300 hover:text-yellow-200 flex items-center justify-center"
                        >
                            <FaArrowLeft className="mr-2" />
                            Return to Forums
                        </button>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    if (!selectedForum) return null;

    return (
        <StudentLayout>
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard/forums')}
                    className="flex items-center text-white/80 hover:text-white mb-4 md:mb-6 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    <span className="text-sm md:text-base">Back to Forums</span>
                </button>

                {/* Forum Header */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 mb-6 md:mb-8">
                    <h1 className="text-xl md:text-3xl font-bold text-white mb-4">
                        {selectedForum.title}
                    </h1>
                    
                    <div className="flex flex-wrap gap-4 md:gap-6 text-white/60 mb-4">
                        <span className="flex items-center">
                            <FaBook className="mr-2 text-yellow-400" />
                            <span className="text-sm md:text-base">{selectedForum.topic}</span>
                        </span>
                        <span className="flex items-center">
                            <FaUser className="mr-2 text-yellow-400" />
                            <span className="text-sm md:text-base">
                                {selectedForum.instructorId.firstName} {selectedForum.instructorId.lastName}
                            </span>
                        </span>
                        <span className="flex items-center">
                            <FaClock className="mr-2 text-yellow-400" />
                            <span className="text-sm md:text-base">{formatTimestamp(selectedForum.createdAt)}</span>
                        </span>
                    </div>

                    <p className="text-white/80 text-sm md:text-lg">
                        {selectedForum.description}
                    </p>
                </div>

                {/* Add Comment Section */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10 mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Add a Comment</h3>
                    <form onSubmit={handleSubmitComment}>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-300/50 min-h-[100px] md:min-h-[120px] resize-none text-sm md:text-base"
                            placeholder="Share your thoughts..."
                        />
                        {submitError && (
                            <p className="mt-2 text-red-400 text-xs md:text-sm">{submitError}</p>
                        )}
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="px-4 md:px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Comments Section */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg md:text-xl font-semibold text-white">
                            Comments
                        </h3>
                        <span className="flex items-center text-white/60 text-sm md:text-base">
                            <FaComments className="mr-2 text-yellow-400" />
                            {selectedForum.comments?.length || 0} Comments
                        </span>
                    </div>

                    {selectedForum.comments?.length > 0 ? (
                        selectedForum.comments.map((comment) => (
                            <CommentCard
                                key={comment._id}
                                comment={comment}
                                onReply={async (commentId, content) => {
                                    try {
                                        await addComment(forumId, content, commentId);
                                    } catch (error) {
                                        console.error('Error adding reply:', error);
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 md:py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                            <FaComments className="mx-auto text-3xl md:text-4xl text-yellow-400 mb-4" />
                            <p className="text-white/60 text-sm md:text-base">No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
};

export default ForumDetailsStudent; 