import React, { useEffect } from 'react';
import { FaBook, FaVideo, FaQuestionCircle, FaPlus, FaGraduationCap } from 'react-icons/fa';
import { useCourse } from '../context/CourseContext';
import CreateCourseForm from './CreateCourseForm';
import CourseList from './CourseList';

const CourseDashboard = () => {
    const {
        courses,
        loading,
        error,
        fetchCourses,
        isCreateModalOpen,
        setIsCreateModalOpen
    } = useCourse();

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <FaGraduationCap className="text-yellow-300 text-3xl" />
                                <span className="text-white text-xl font-bold">NextGen Academy</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-2 text-white/60">
                                <FaBook className="text-yellow-300/60" />
                                <span>Course Management</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FaPlus className="mr-2" />
                            Create New Course
                        </button>
                    </div>

                    {/* Dashboard Title */}
                    <div className="px-6 py-8 bg-gradient-to-r from-white/5 to-transparent">
                        <h1 className="text-4xl font-bold text-white flex items-center mb-3">
                            <FaBook className="mr-4 text-yellow-300" />
                            Course Management
                        </h1>
                        <p className="text-lg text-white/60 max-w-2xl">
                            Create and manage your courses, organize content, and deliver engaging learning experiences
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <div className="flex items-center mb-2">
                            <FaBook className="text-yellow-300 mr-2" />
                            <h4 className="text-white/60">Total Courses</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{courses.length}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <div className="flex items-center mb-2">
                            <FaVideo className="text-yellow-300 mr-2" />
                            <h4 className="text-white/60">Total Videos</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {courses.reduce((total, course) => 
                                total + (course.sequence?.filter(item => item.contentType === 'video').length || 0), 0
                            )}
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <div className="flex items-center mb-2">
                            <FaQuestionCircle className="text-yellow-300 mr-2" />
                            <h4 className="text-white/60">Total Quizzes</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {courses.reduce((total, course) => 
                                total + (course.sequence?.filter(item => item.contentType === 'quiz').length || 0), 0
                            )}
                        </p>
                    </div>
                </div>

                {/* Course List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-yellow-300 mb-4"></div>
                        <p className="text-white/60">Loading courses...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 px-4">
                        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-xl p-6 max-w-lg mx-auto">
                            <p className="text-red-200 text-lg">{error}</p>
                        </div>
                    </div>
                ) : (
                    <CourseList />
                )}
            </div>

            {/* Create Course Modal */}
            {isCreateModalOpen && <CreateCourseForm />}
        </div>
    );
};

export default CourseDashboard;