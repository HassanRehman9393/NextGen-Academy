import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiMessageCircle, FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useRatingManagement } from '../context/RatingManagementContext';
import ResponseModal from './ResponseModal';
import RatingOverview from './RatingOverview';
import { formatDistanceToNow } from 'date-fns';

const RatingCard = ({ rating, onRespond, onDeleteResponse }) => (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={`${
                                    i < rating.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-white/40'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-white/60">
                        {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <h3 className="text-white font-medium">
                    {rating.student.firstName} {rating.student.lastName}
                </h3>
            </div>
        </div>

        <p className="text-white/80 mb-4">{rating.feedback}</p>

        {rating.instructorResponse ? (
            <div className="bg-white/5 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-yellow-300 font-medium">Your Response</h4>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onRespond(rating)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-yellow-300 transition-colors"
                        >
                            <FiEdit2 />
                        </button>
                        <button
                            onClick={() => onDeleteResponse(rating.instructorResponse._id, rating._id)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-400 transition-colors"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
                <p className="text-white/70">{rating.instructorResponse.response}</p>
            </div>
        ) : (
            <button
                onClick={() => onRespond(rating)}
                className="text-yellow-300 hover:text-yellow-200 flex items-center gap-2 text-sm"
            >
                <FiMessageCircle />
                Respond to feedback
            </button>
        )}
    </div>
);

const RatingList = () => {
    const { courseId } = useParams();
    const { 
        ratings, 
        loading, 
        error, 
        getCourseRatings,
        respondToRating,
        deleteResponse
    } = useRatingManagement();

    const [selectedRating, setSelectedRating] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        const loadRatings = async () => {
            try {
                setLocalLoading(true);
                setLocalError(null);
                console.log('Fetching ratings for course:', courseId);
                await getCourseRatings(courseId);
            } catch (err) {
                console.error('Error loading ratings:', err);
                setLocalError(err.message || 'Failed to load ratings');
            } finally {
                setLocalLoading(false);
            }
        };

        if (courseId) {
            loadRatings();
        }
    }, [courseId, getCourseRatings]);

    const handleRespond = (rating) => {
        setSelectedRating(rating);
        setIsModalOpen(true);
    };

    const handleSubmitResponse = async (response) => {
        try {
            setLocalLoading(true);
            await respondToRating(selectedRating._id, response);
            setIsModalOpen(false);
            setSelectedRating(null);
            // Refresh ratings after response
            await getCourseRatings(courseId);
        } catch (err) {
            console.error('Error submitting response:', err);
            setLocalError(err.message);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDeleteResponse = async (responseId, ratingId) => {
        try {
            setLocalLoading(true);
            await deleteResponse(responseId, ratingId);
            // Refresh ratings after deletion
            await getCourseRatings(courseId);
        } catch (err) {
            console.error('Error deleting response:', err);
            setLocalError(err.message);
        } finally {
            setLocalLoading(false);
        }
    };

    if (localLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-yellow-300"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (localError || error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl p-4 text-red-300 text-center">
                        {localError || error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/instructor/ratings"
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <FiArrowLeft className="text-2xl" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Course Ratings & Feedback</h1>
                    </div>
                </div>

                {/* Analytics Overview */}
                <RatingOverview courseId={courseId} />

                {/* Ratings List */}
                <div className="space-y-6 mt-8">
                    {ratings && ratings.length > 0 ? (
                        ratings.map(rating => (
                            <RatingCard
                                key={rating._id}
                                rating={rating}
                                onRespond={handleRespond}
                                onDeleteResponse={handleDeleteResponse}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                            <FiMessageCircle className="text-4xl text-yellow-300 mx-auto mb-4" />
                            <p className="text-white/60">No ratings yet for this course</p>
                        </div>
                    )}
                </div>
            </div>

            <ResponseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedRating(null);
                }}
                onSubmit={handleSubmitResponse}
                initialResponse={selectedRating?.instructorResponse?.response}
            />
        </div>
    );
};

export default RatingList; 