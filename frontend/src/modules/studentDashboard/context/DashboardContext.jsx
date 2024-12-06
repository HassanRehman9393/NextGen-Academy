import React, { createContext, useContext, useState, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [videos, setVideos] = useState([]);
    const [activeView, setActiveView] = useState('courses');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        difficultyLevel: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });
    const [enrollments, setEnrollments] = useState([]);
    const [currentEnrollment, setCurrentEnrollment] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizProgress, setQuizProgress] = useState(null);

    const fetchCourses = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page,
                limit: 12,
                ...(searchQuery && { search: searchQuery }),
                ...(filters.category && { category: filters.category }),
                ...(filters.difficultyLevel && { difficultyLevel: filters.difficultyLevel })
            };

            const response = await (searchQuery 
                ? dashboardService.searchCourses(params)
                : dashboardService.getAllCourses(params)
            );

            setCourses(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message || 'Failed to fetch courses');
            setCourses([]);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalItems: 0
            });
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters]);

    const fetchVideos = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page,
                limit: 12,
                ...(searchQuery && { search: searchQuery }),
                ...(filters.category && { category: filters.category })
            };

            const response = await (searchQuery 
                ? dashboardService.searchVideos(params)
                : dashboardService.getAllVideos(params)
            );

            setVideos(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError(err.message || 'Failed to fetch videos');
            setVideos([]);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalItems: 0
            });
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters]);

    const getCourseById = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);
            console.log('DashboardContext: Fetching course with ID:', courseId);
            const response = await dashboardService.getCourseById(courseId);
            console.log('DashboardContext: Received response:', response);
            
            if (response && response.success && response.data) {
                return response;
            } else {
                throw new Error('Invalid course data format');
            }
        } catch (err) {
            console.error('DashboardContext: Error fetching course:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getVideoById = useCallback(async (videoId) => {
        try {
            setLoading(true);
            setError(null);
            console.log('DashboardContext: Fetching video with ID:', videoId);
            const response = await dashboardService.getVideoById(videoId);
            console.log('DashboardContext: Received response:', response);
            return response;
        } catch (err) {
            console.error('DashboardContext: Error fetching video:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const enrollInCourse = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.enrollInCourse(courseId);
            setCurrentEnrollment(response.data);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProgress = useCallback(async (courseId, contentId, progressData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.updateContentProgress(courseId, contentId, progressData);
            setCurrentEnrollment(response.data);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getEnrollmentStatus = useCallback(async (courseId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardService.getEnrollmentStatus(courseId);
            setCurrentEnrollment(response.data);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuizById = useCallback(async (quizId) => {
        try {
            setLoading(true);
            setError(null);
            console.log('DashboardContext: Fetching quiz with ID:', quizId);
            const response = await dashboardService.getQuizById(quizId);
            console.log('DashboardContext: Received response:', response);
            
            if (response && response.success) {
                setCurrentQuiz(response.data);
                return response;
            } else {
                throw new Error('Invalid quiz data format');
            }
        } catch (err) {
            console.error('DashboardContext: Error fetching quiz:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const submitQuizAttempt = useCallback(async (quizId, answers) => {
        try {
            setLoading(true);
            setError(null);
            console.log('DashboardContext: Submitting quiz attempt:', { quizId, answers });
            const response = await dashboardService.submitQuizAttempt(quizId, answers);
            
            if (response && response.success) {
                // Update quiz progress after submission
                await getQuizProgress(quizId);
                return response;
            } else {
                throw new Error('Failed to submit quiz');
            }
        } catch (err) {
            console.error('DashboardContext: Error submitting quiz:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuizProgress = useCallback(async (quizId) => {
        try {
            setLoading(true);
            setError(null);
            console.log('DashboardContext: Getting quiz progress:', quizId);
            const response = await dashboardService.getQuizProgress(quizId);
            
            if (response && response.success) {
                setQuizProgress(response.data);
                return response;
            } else {
                throw new Error('Failed to get quiz progress');
            }
        } catch (err) {
            console.error('DashboardContext: Error getting quiz progress:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        loading,
        error,
        courses,
        videos,
        activeView,
        setActiveView,
        searchQuery,
        filters,
        pagination,
        selectedCourse,
        selectedVideo,
        handleSearch: (query) => {
            setSearchQuery(query);
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            if (activeView === 'courses') {
                fetchCourses(1);
            } else {
                fetchVideos(1);
            }
        },
        handleCategoryFilter: (category) => {
            setFilters(prev => ({ ...prev, category }));
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            if (activeView === 'courses') {
                fetchCourses(1);
            } else {
                fetchVideos(1);
            }
        },
        handleDifficultyFilter: (difficultyLevel) => {
            setFilters(prev => ({ ...prev, difficultyLevel }));
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            if (activeView === 'courses') {
                fetchCourses(1);
            } else {
                fetchVideos(1);
            }
        },
        handlePageChange: (newPage) => {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
            if (activeView === 'courses') {
                fetchCourses(newPage);
            } else {
                fetchVideos(newPage);
            }
        },
        fetchCourses,
        fetchVideos,
        getCourseById,
        getVideoById,
        enrollments,
        currentEnrollment,
        enrollInCourse,
        updateProgress,
        getEnrollmentStatus,
        currentQuiz,
        quizProgress,
        getQuizById,
        submitQuizAttempt,
        getQuizProgress
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export default DashboardContext; 