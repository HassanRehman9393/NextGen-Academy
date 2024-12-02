import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('courses');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [videos, setVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        difficultyLevel: '',
        duration: '',
        rating: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12
    });

    // Check authentication and fetch initial data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Clean token if it has 'Bearer ' prefix
        if (token.startsWith('Bearer ')) {
            const cleanToken = token.replace('Bearer ', '');
            localStorage.setItem('token', cleanToken);
        }

        // Initial data fetch
        fetchCourses(1);
    }, [navigate]);

    const fetchCourses = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = {
                page,
                limit: pagination.itemsPerPage,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            };

            // Add search if exists
            if (searchQuery.trim()) {
                queryParams.search = searchQuery.trim();
            }

            // Add filters if they exist
            if (filters.category) queryParams.category = filters.category;
            if (filters.difficultyLevel) queryParams.difficultyLevel = filters.difficultyLevel;
            if (filters.rating) queryParams.minRating = filters.rating;

            console.log('Fetching courses with params:', queryParams);
            const response = await dashboardService.getCourses(queryParams);

            if (response.success) {
                setCourses(response.data);
                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalPages: Math.ceil(response.pagination.totalItems / pagination.itemsPerPage),
                    totalItems: response.pagination.totalItems
                }));
            } else {
                throw new Error(response.message || 'Failed to fetch courses');
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, pagination.itemsPerPage]);

    const fetchVideos = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = {
                page,
                limit: pagination.itemsPerPage,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            };

            // Add search if exists
            if (searchQuery.trim()) {
                queryParams.search = searchQuery.trim();
            }

            // Add filters if they exist
            if (filters.category) queryParams.category = filters.category;
            if (filters.duration) queryParams.duration = filters.duration;

            console.log('Fetching videos with params:', queryParams);
            const response = await dashboardService.getVideos(queryParams);

            if (response.success) {
                setVideos(response.data);
                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalPages: Math.ceil(response.pagination.totalItems / pagination.itemsPerPage),
                    totalItems: response.pagination.totalItems
                }));
            } else {
                throw new Error(response.message || 'Failed to fetch videos');
            }
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError(err.message);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, pagination.itemsPerPage]);

    // Handle search changes with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeView === 'courses') {
                fetchCourses(1);
            } else {
                fetchVideos(1);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, filters, activeView]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, []);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, []);

    const handlePageChange = useCallback((page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        if (activeView === 'courses') {
            fetchCourses(page);
        } else {
            fetchVideos(page);
        }
    }, [activeView, fetchCourses, fetchVideos]);

    // Reset filters when switching views
    useEffect(() => {
        setFilters({
            category: '',
            difficultyLevel: '',
            duration: '',
            rating: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setSearchQuery('');
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, [activeView]);

    const value = {
        activeView,
        setActiveView,
        loading,
        error,
        courses,
        videos,
        searchQuery,
        filters,
        pagination,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        fetchCourses,
        fetchVideos,
        dashboardService
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