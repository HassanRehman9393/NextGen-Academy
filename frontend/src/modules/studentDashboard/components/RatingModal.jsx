import React, { useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';

const RatingModal = ({ isOpen, onClose, onSubmit, initialRating = null }) => {
    const [rating, setRating] = useState(initialRating?.rating || 0);
    const [feedback, setFeedback] = useState(initialRating?.feedback || '');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!feedback.trim()) {
            setError('Please provide feedback');
            return;
        }

        console.log('Submitting rating:', { rating, feedback });
        onSubmit({ rating, feedback });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {initialRating ? 'Update Rating' : 'Rate This Course'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <FiX className="text-white text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    onClick={() => setRating(star)}
                                    className="p-2 transition-transform hover:scale-110"
                                >
                                    <FiStar
                                        className={`text-3xl ${
                                            (hoveredStar || rating) >= star
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-white/40'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-white/60">
                            {rating ? `${rating} out of 5 stars` : 'Select a rating'}
                        </span>
                    </div>

                    {/* Feedback */}
                    <div>
                        <label className="block text-white mb-2">Your Feedback</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50"
                            rows="4"
                            placeholder="Share your experience with this course..."
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
                        >
                            {initialRating ? 'Update Rating' : 'Submit Rating'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal; 