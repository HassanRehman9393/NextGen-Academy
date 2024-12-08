import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiBook, FiArrowLeft } from 'react-icons/fi';
import courseService from '../../courseManagement/services/courseService';

const CourseCard = ({ course }) => (
    <Link
        to={`/instructor/analytics/${course._id}`}
        className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:scale-105 transition-all duration-300"
    >
        <div className="flex items-center gap-3 mb-4">
            <FiBook className="text-2xl text-yellow-300" />
            <h3 className="text-lg font-semibold text-white">{course.title}</h3>
        </div>
        <p className="text-white/60 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs">Enrolled</p>
                <p className="text-white font-semibold">{course.enrollmentCount || 0}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/60 text-xs">Rating</p>
                <p className="text-white font-semibold">{course.averageRating?.toFixed(1) || 'N/A'}</p>
            </div>
        </div>
        <div className="mt-4 text-sm text-yellow-300/80 hover:text-yellow-300 transition-colors text-right">
            View Analytics →
        </div>
    </Link>
);

const AnalyticsDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getInstructorCourses();
            setCourses(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 p-8">
                <div className="text-white text-center">Loading courses...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 p-8">
                <div className="text-red-400 text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/instructor"
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <FiArrowLeft className="text-2xl" />
                        </Link>
                        <FiBarChart2 className="text-3xl text-yellow-300" />
                        <h1 className="text-2xl font-bold text-white">Course Analytics</h1>
                    </div>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h3 className="text-white/60">Total Courses</h3>
                        <p className="text-3xl font-bold text-white">{courses.length}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h3 className="text-white/60">Total Students</h3>
                        <p className="text-3xl font-bold text-white">
                            {courses.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h3 className="text-white/60">Average Rating</h3>
                        <p className="text-3xl font-bold text-white">
                            {(courses.reduce((acc, course) => acc + (course.averageRating || 0), 0) / courses.length || 0).toFixed(1)}
                        </p>
                    </div>
                </div>

                {/* Course List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 