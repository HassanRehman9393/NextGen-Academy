import React, { useEffect } from 'react';
import { FaVideo, FaBook } from 'react-icons/fa';
import SearchBar from './SearchBar';
import CourseList from './CourseList';
import VideoList from './VideoList';
import Pagination from './Pagination';
import { useDashboard } from '../context/DashboardContext';
import StudentLayout from './StudentLayout';

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
        <StudentLayout>
            <div className="space-y-6">
                {/* Content Section */}
                <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
                    {/* View Toggle and Search */}
                    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                        {/* View Toggle */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveView('courses')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    activeView === 'courses'
                                        ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                        : 'text-white hover:bg-white/10'
                                }`}
                                disabled={loading}
                            >
                                <FaBook />
                                <span>Courses</span>
                            </button>
                            <button
                                onClick={() => setActiveView('videos')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    activeView === 'videos'
                                        ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                        : 'text-white hover:bg-white/10'
                                }`}
                                disabled={loading}
                            >
                                <FaVideo />
                                <span>Videos</span>
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
                    <div className="p-4 md:p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 md:w-16 md:h-16 mb-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                <p className="text-white/60 text-sm md:text-lg">Loading {activeView}...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="max-w-lg mx-auto p-6 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl">
                                    <p className="text-red-300 text-sm md:text-lg mb-4">{error}</p>
                                    <button
                                        onClick={() => activeView === 'courses' ? fetchCourses() : fetchVideos()}
                                        className="px-6 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm md:text-base"
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
                                    <div className="mt-6 md:mt-8">
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
        </StudentLayout>
    );
};

export default Dashboard; 