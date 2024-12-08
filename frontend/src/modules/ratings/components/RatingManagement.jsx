import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiMessageCircle, FiArrowLeft } from 'react-icons/fi';
import courseService from '../../courseManagement/services/courseService';
import { FaGraduationCap, FaPlus, FaStar } from 'react-icons/fa';

const CourseCard = ({ course }) => (
    <Link
        to={`/instructor/ratings/${course._id}`}
        className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:scale-105 transition-all duration-300"
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
            <div className="flex items-center gap-2 text-yellow-400">
                <FiStar />
                <span>{course.averageRating?.toFixed(1) || 'N/A'}</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-sm">Total Ratings</p>
                <p className="text-white font-semibold">{course.totalRatings || 0}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-sm">Feedback Count</p>
                <p className="text-white font-semibold">{course.totalRatings || 0}</p>
            </div>
        </div>
        <div className="mt-4 text-sm text-yellow-300/80 hover:text-yellow-300 transition-colors text-right">
            View Ratings & Feedback →
        </div>
    </Link>
);

const RatingManagement = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await courseService.getInstructorCourses();
                if (response.success && response.data) {
                    setCourses(response.data);
                } else {
                    throw new Error('Failed to fetch courses');
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

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
                                <FaStar className="text-yellow-300/60" />
                                <span>Rating Management</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/instructor')}
                            className="flex items-center px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    {/* Dashboard Title */}
                    <div className="px-6 py-8 bg-gradient-to-r from-white/5 to-transparent">
                        <h1 className="text-4xl font-bold text-white flex items-center mb-3">
                            <FaStar className="mr-4 text-yellow-300" />
                            Rating Management
                        </h1>
                        <p className="text-lg text-white/60 max-w-2xl">
                            View and respond to student ratings and feedback to improve your courses
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
                            <FaStar className="text-yellow-300 mr-2" />
                            <h4 className="text-white/60">Total Courses</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">{courses.length}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <div className="flex items-center mb-2">
                            <FaStar className="text-yellow-300 mr-2" />
                            <h4 className="text-white/60">Average Rating</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {(courses.reduce((acc, course) => acc + (course.averageRating || 0), 0) / courses.length || 0).toFixed(1)}
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <div className="flex items-center mb-2">
                            <FaStar className="text-yellow-300 mr-2" />
                            <h4 className="text-white/60">Total Feedback</h4>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {courses.reduce((acc, course) => acc + (course.totalRatings || 0), 0)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                        {courses.length === 0 && (
                            <div className="col-span-3 text-center py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                <FaStar className="text-4xl text-yellow-300 mx-auto mb-4" />
                                <p className="text-white/60">No courses found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RatingManagement; 