import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import dashboardService from '../services/dashboardService';
import { formatDuration, formatRating, getDifficultyColor } from '../utils/filterHelper';
import { FiClock, FiBook, FiAward, FiPlay, FiClipboard } from 'react-icons/fi';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { getCourseById, loading, error } = useDashboard();
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const data = await getCourseById(courseId);
                setCourse(data);
                // Fetch student's progress if enrolled
                if (data.isEnrolled) {
                    const progressData = await dashboardService.getCourseProgress(courseId);
                    setProgress(progressData.progress);
                }
            } catch (err) {
                console.error('Error fetching course:', err);
            }
        };

        fetchCourseDetails();
    }, [courseId, getCourseById]);

    const handleEnroll = async () => {
        try {
            await dashboardService.enrollInCourse(courseId);
            // Refresh course data to update enrollment status
            const updatedCourse = await getCourseById(courseId);
            setCourse(updatedCourse);
        } catch (err) {
            console.error('Error enrolling in course:', err);
        }
    };

    const handleStartContent = (contentId, type) => {
        if (type === 'video') {
            navigate(`/dashboard/videos/${contentId}`);
        } else if (type === 'quiz') {
            navigate(`/dashboard/quizzes/${contentId}`);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!course) return <div className="text-center p-4">Course not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                    <span className="flex items-center gap-2">
                        <FiClock className="text-gray-500" />
                        {formatDuration(course.duration)}
                    </span>
                    <span className="flex items-center gap-2">
                        <FiBook className="text-gray-500" />
                        {course.contentCount} lessons
                    </span>
                    <span className={`flex items-center gap-2 ${getDifficultyColor(course.difficultyLevel)}`}>
                        <FiAward />
                        {course.difficultyLevel}
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="text-yellow-400">★</span>
                        {formatRating(course.rating)}
                    </span>
                </div>
                <p className="text-gray-600 mb-6">{course.description}</p>
                {!course.isEnrolled ? (
                    <button
                        onClick={handleEnroll}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Enroll Now
                    </button>
                ) : (
                    <div className="bg-gray-100 p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">Course Progress</span>
                            <span className="text-blue-600 font-semibold">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <div className="space-y-4">
                    {course.content?.map((item, index) => (
                        <div
                            key={item._id}
                            className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {item.type === 'video' ? (
                                        <FiPlay className="text-blue-500" />
                                    ) : (
                                        <FiClipboard className="text-green-500" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        {item.type === 'video' && (
                                            <p className="text-sm text-gray-500">
                                                {formatDuration(item.duration)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {course.isEnrolled && (
                                    <button
                                        onClick={() => handleStartContent(item._id, item.type)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        {item.completed ? 'Review' : 'Start'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail; 