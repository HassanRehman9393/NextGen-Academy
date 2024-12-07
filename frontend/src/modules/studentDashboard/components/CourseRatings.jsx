import React, { useState, useEffect } from 'react';
import { FiStar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import ratingService from '../services/ratingService';
import RatingModal from './RatingModal';

const CourseRatings = ({ courseId, enrollment }) => {
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRatings = async () => {
        try {
            const [ratingsResponse, userRatingResponse] = await Promise.all([
                ratingService.getCourseRatings(courseId),
                ratingService.getStudentRating(courseId)
            ]);
            setRatings(ratingsResponse.data.ratings);
            setUserRating(userRatingResponse.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('CourseRatings - Current enrollment:', enrollment);
        console.log('Can rate course:', enrollment?.isEnrolled);
        
        if (enrollment?.isEnrolled) {
            fetchRatings();
        }
    }, [courseId, enrollment]);

    const handleRatingSubmit = async (ratingData) => {
        try {
            console.log('Submitting rating:', ratingData);
            setError(null);
            
            if (userRating) {
                await ratingService.updateRating(userRating._id, ratingData);
            } else {
                await ratingService.addRating(courseId, ratingData);
            }
            
            await fetchRatings();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error submitting rating:', err);
            setError(err.message || 'Failed to submit rating');
        }
    };

    const handleDeleteRating = async () => {
        try {
            await ratingService.deleteRating(userRating._id);
            setUserRating(null);
            await fetchRatings();
        } catch (err) {
            setError(err.message);
        }
    };

    const canRate = enrollment?.isEnrolled;

    if (loading) {
        return <div className="text-white/60">Loading ratings...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Course Ratings</h2>
                    <p className="text-sm text-white/60 mt-1">
                        {!enrollment?.isEnrolled ? (
                            "Enroll in this course to leave a rating"
                        ) : (
                            `Course Progress: ${enrollment.progress}%`
                        )}
                    </p>
                </div>
                {canRate && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 flex items-center gap-2"
                    >
                        {userRating ? <FiEdit2 /> : <FiStar />}
                        {userRating ? 'Edit Rating' : 'Rate Course'}
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {ratings.map((rating) => (
                    <div
                        key={rating._id}
                        className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
                    >
                        <div className="flex justify-between items-start">
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
                                <p className="text-white font-medium">
                                    {rating.student.firstName} {rating.student.lastName}
                                </p>
                            </div>
                            {rating.student._id === userRating?.student && (
                                <button
                                    onClick={handleDeleteRating}
                                    className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-red-400 transition-colors"
                                >
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                        <p className="mt-3 text-white/80">{rating.feedback}</p>
                    </div>
                ))}

                {ratings.length === 0 && (
                    <div className="text-center py-8 text-white/60">
                        No ratings yet. Be the first to rate this course!
                    </div>
                )}
            </div>

            <RatingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleRatingSubmit}
                initialRating={userRating}
            />
        </div>
    );
};

export default CourseRatings; 