import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentForum } from '../context/StudentForumContext';
import CommentCard from './CommentCard';
import { validateComment } from '../utils/studentValidationUtils';

const ForumDetailsStudent = () => {
    const { forumId } = useParams();
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

        try {
            const validationError = validateComment(commentText);
            if (validationError) {
                setSubmitError(validationError);
                return;
            }

            await addComment(forumId, commentText);
            setCommentText('');
        } catch (error) {
            setSubmitError(error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!selectedForum) return <div>Forum not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{selectedForum.title}</h1>
                <div className="text-gray-600 mb-4">
                    <span>Topic: {selectedForum.topic}</span>
                    <span className="mx-2">•</span>
                    <span>
                        By: {selectedForum.instructorId.firstName} {selectedForum.instructorId.lastName}
                    </span>
                </div>
                <p className="text-gray-700">{selectedForum.description}</p>
            </div>

            {/* Comment Form */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
                <form onSubmit={handleSubmitComment}>
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-2"
                        rows="4"
                        placeholder="Write your comment here..."
                    />
                    {submitError && (
                        <p className="text-red-500 text-sm mb-2">{submitError}</p>
                    )}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Submit Comment
                    </button>
                </form>
            </div>

            {/* Comments List */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                {selectedForum.comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                ) : (
                    <div className="space-y-4">
                        {selectedForum.comments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumDetailsStudent; 