import React, { useEffect } from 'react';
import { useRatingManagement } from '../context/RatingManagementContext';
import { FiStar, FiMessageCircle, FiBarChart2, FiUsers } from 'react-icons/fi';

const RatingOverview = ({ courseId }) => {
    const { analytics, loading, error, getRatingAnalytics } = useRatingManagement();

    useEffect(() => {
        if (courseId) {
            getRatingAnalytics(courseId);
        }
    }, [courseId, getRatingAnalytics]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl p-4 text-red-300 text-center">
                {error}
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Average Rating Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                    <FiStar className="text-yellow-400 text-xl" />
                    <h3 className="text-white/60 text-lg">Average Rating</h3>
                    <span className="text-2xl font-bold text-white ml-auto">
                        {analytics.averageRating.toFixed(1)}
                    </span>
                </div>
                <div className="space-y-2">
                    {Object.entries(analytics.ratingDistribution)
                        .reverse()
                        .map(([rating, count]) => (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-white/60 w-8">{rating}★</span>
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                                        style={{ 
                                            width: `${(count / analytics.totalRatings) * 100}%` 
                                        }}
                                    />
                                </div>
                                <span className="text-white/60 w-12 text-right">{count}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Total Ratings Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <FiUsers className="text-yellow-400 text-xl" />
                    <h3 className="text-white/60">Total Ratings</h3>
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-white">{analytics.totalRatings}</p>
                    <p className="text-white/40 text-sm mt-1">Total feedback received</p>
                </div>
            </div>

            {/* Response Rate Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-2">
                    <FiMessageCircle className="text-yellow-400 text-xl" />
                    <h3 className="text-white/60">Response Rate</h3>
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-white">
                        {analytics.responseRate.toFixed(1)}%
                    </p>
                    <p className="text-white/40 text-sm mt-1">Feedback responses</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-1 lg:col-span-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-300 bg-yellow-400/20">
                            Response Progress
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-yellow-300">
                            {analytics.responseRate.toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-white/10">
                    <div
                        style={{ width: `${analytics.responseRate}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default RatingOverview; 