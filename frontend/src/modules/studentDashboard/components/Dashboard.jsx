import React, { useEffect } from 'react';
import { FaGraduationCap, FaVideo, FaSearch, FaBookReader, FaClock, FaUserGraduate } from 'react-icons/fa';
import { useDashboard } from '../context/DashboardContext';
import CourseList from './CourseList';
import VideoList from './VideoList';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <div className="flex items-center mb-2">
            <Icon className="text-yellow-300 text-xl mr-2" />
            <h4 className="text-white/60">{title}</h4>
        </div>
        <div className="text-3xl font-bold text-white">{value}</div>
    </div>
);

const Dashboard = () => {
    const {
        activeView,
        setActiveView,
        loading,
        error,
        fetchCourses,
        fetchVideos,
        pagination,
        searchQuery,
        filters,
        courses,
        videos
    } = useDashboard();

    // Initial fetch when component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            if (activeView === 'courses') {
                await fetchCourses(1);
            } else {
                await fetchVideos(1);
            }
        };

        fetchInitialData();
    }, []); // Empty dependency array for initial mount

    // Fetch when view, search, or filters change
    useEffect(() => {
        const fetchData = async () => {
            if (activeView === 'courses') {
                await fetchCourses(1);
            } else {
                await fetchVideos(1);
            }
        };

        fetchData();
    }, [activeView, searchQuery, filters]);

    const handleViewChange = (view) => {
        setActiveView(view);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <FaUserGraduate className="text-yellow-300 text-4xl" />
                            <div>
                                <h1 className="text-2xl font-bold text-white">Learning Dashboard</h1>
                                <p className="text-white/60">Explore courses and videos to enhance your knowledge</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* View Toggle and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleViewChange('courses')}
                            className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                                activeView === 'courses'
                                    ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-300/30'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            <FaGraduationCap className="mr-2" />
                            Courses
                        </button>
                        <button
                            onClick={() => handleViewChange('videos')}
                            className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                                activeView === 'videos'
                                    ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-300/30'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            <FaVideo className="mr-2" />
                            Videos
                        </button>
                    </div>
                    <SearchBar />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                        icon={FaBookReader} 
                        title="Available Courses" 
                        value={courses.length} 
                    />
                    <StatCard 
                        icon={FaVideo} 
                        title="Available Videos" 
                        value={videos.length} 
                    />
                    <StatCard 
                        icon={FaClock} 
                        title="Hours of Content" 
                        value={`${Math.round((courses.length + videos.length) * 1.5)}+`} 
                    />
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-300 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        {/* Content List */}
                        <div className="mb-8">
                            {activeView === 'courses' ? <CourseList /> : <VideoList />}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && <Pagination />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 