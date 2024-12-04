import React, { useEffect } from 'react';
import { FaGraduationCap, FaVideo, FaBook, FaChalkboardTeacher } from 'react-icons/fa';
import SearchBar from './SearchBar';
import CourseList from './CourseList';
import VideoList from './VideoList';
import Pagination from './Pagination';
import { useDashboard } from '../context/DashboardContext';

const Dashboard = () => {
    const {
        activeView,
        setActiveView,
        loading,
        error,
        pagination,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        fetchCourses,
        fetchVideos
    } = useDashboard();

    useEffect(() => {
        if (activeView === 'courses') {
            fetchCourses();
        } else {
            fetchVideos();
        }
    }, [activeView, fetchCourses, fetchVideos]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
            {/* Header Section */}
            <div className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-400/10 rounded-2xl">
                                <FaGraduationCap className="text-3xl text-yellow-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
                                <p className="text-white/60 text-sm">Explore and learn from our extensive collection</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <FaBook className="text-yellow-400" />
                                <div>
                                    <div className="text-sm text-white/60">Courses</div>
                                    <div className="text-lg font-semibold text-white">12</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <FaChalkboardTeacher className="text-yellow-400" />
                                <div>
                                    <div className="text-sm text-white/60">Instructors</div>
                                    <div className="text-lg font-semibold text-white">8</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* View Toggle and Search Section */}
                <div className="space-y-6 mb-8">
                    {/* View Toggle */}
                    <div className="inline-flex p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                        <button
                            onClick={() => setActiveView('courses')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                activeView === 'courses'
                                    ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                    : 'text-white hover:bg-white/10'
                            }`}
                            disabled={loading}
                        >
                            <div className="flex items-center gap-2">
                                <FaBook />
                                <span>Courses</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveView('videos')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                activeView === 'videos'
                                    ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                    : 'text-white hover:bg-white/10'
                            }`}
                            disabled={loading}
                        >
                            <div className="flex items-center gap-2">
                                <FaVideo />
                                <span>Videos</span>
                            </div>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <SearchBar
                        onSearch={handleSearch}
                        onFilterChange={handleFilterChange}
                        disabled={loading}
                    />
                </div>

                {/* Content Area */}
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 mb-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-white/60 text-lg">Loading {activeView}...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="max-w-lg mx-auto p-6 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl">
                                    <p className="text-red-300 text-lg mb-4">{error}</p>
                                    <button
                                        onClick={() => activeView === 'courses' ? fetchCourses() : fetchVideos()}
                                        className="px-6 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {activeView === 'courses' ? (
                                    <CourseList />
                                ) : (
                                    <VideoList />
                                )}
                                
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={pagination.currentPage || 1}
                                            totalPages={pagination.totalPages || 1}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 