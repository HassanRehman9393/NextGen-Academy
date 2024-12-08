import React, { createContext, useContext, useState, useCallback } from 'react';
import ratingManagementService from '../services/ratingManagementService';

const RatingManagementContext = createContext();

export const useRatingManagement = () => {
    const context = useContext(RatingManagementContext);
    if (!context) {
        throw new Error('useRatingManagement must be used within a RatingManagementProvider');
    }
    return context;
};

export const RatingManagementProvider = ({ children }) => {
    const [ratings, setRatings] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCourseRatings = useCallback(async (courseId) => {
        console.log('Getting course ratings for:', courseId);
        try {
            setLoading(true);
            setError(null);
            const response = await ratingManagementService.getCourseRatings(courseId);
            console.log('Ratings response:', response);
            
            if (response.success) {
                setRatings(response.data.ratings || []);
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to fetch ratings');
            }
        } catch (err) {
            console.error('Error in getCourseRatings:', err);
            setError(err.message);
            setRatings([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRatingAnalytics = useCallback(async (courseId) => {
        console.log('Getting rating analytics for:', courseId);
        try {
            const response = await ratingManagementService.getRatingAnalytics(courseId);
            console.log('Analytics response:', response);
            
            if (response.success) {
                setAnalytics(response.data);
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to fetch analytics');
            }
        } catch (err) {
            console.error('Error in getRatingAnalytics:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    const respondToRating = async (ratingId, response) => {
        console.log('Responding to rating:', { ratingId, responseLength: response?.length });
        try {
            setLoading(true);
            const result = await ratingManagementService.respondToRating(ratingId, response);
            console.log('Response result:', result);
            
            if (result.success) {
                setRatings(prev => prev.map(rating => 
                    rating._id === ratingId 
                        ? { ...rating, instructorResponse: result.data }
                        : rating
                ));
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to submit response');
            }
        } catch (err) {
            console.error('Error in respondToRating:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteResponse = async (responseId, ratingId) => {
        console.log('Deleting response:', { responseId, ratingId });
        try {
            setLoading(true);
            const result = await ratingManagementService.deleteResponse(responseId);
            console.log('Delete result:', result);
            
            if (result.success) {
                setRatings(prev => prev.map(rating => 
                    rating._id === ratingId 
                        ? { ...rating, instructorResponse: null }
                        : rating
                ));
            } else {
                throw new Error(result.message || 'Failed to delete response');
            }
        } catch (err) {
            console.error('Error in deleteResponse:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        ratings,
        analytics,
        loading,
        error,
        getCourseRatings,
        respondToRating,
        deleteResponse,
        getRatingAnalytics
    };

    return (
        <RatingManagementContext.Provider value={value}>
            {children}
        </RatingManagementContext.Provider>
    );
};

export default RatingManagementContext; 