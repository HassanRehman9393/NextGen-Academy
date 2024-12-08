import { useState, useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';

export const useAnalyticsData = (courseId) => {
    const { fetchAnalytics, downloadReport } = useAnalytics();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (courseId) {
            loadAnalytics();
        }
    }, [courseId]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const analyticsData = await fetchAnalytics(courseId);
            setData(analyticsData);
        } catch (err) {
            console.error('Error loading analytics:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async (type) => {
        try {
            setLoading(true);
            const blob = await downloadReport(courseId, type);
            
            // Create and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `course-analytics-${courseId}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        refreshData: loadAnalytics,
        downloadReport: handleDownloadReport
    };
}; 