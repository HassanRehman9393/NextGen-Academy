import React, { createContext, useContext, useState } from 'react';
import analyticsService from '../services/analyticsService';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context;
};

export const AnalyticsProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnalytics = async (courseId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await analyticsService.getCourseAnalytics(courseId);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (courseId, type) => {
        try {
            setLoading(true);
            setError(null);
            if (type === 'pdf') {
                return await analyticsService.downloadPDFReport(courseId);
            } else {
                return await analyticsService.downloadExcelReport(courseId);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        loading,
        error,
        fetchAnalytics,
        downloadReport
    };

    return (
        <AnalyticsContext.Provider value={value}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export default AnalyticsContext; 