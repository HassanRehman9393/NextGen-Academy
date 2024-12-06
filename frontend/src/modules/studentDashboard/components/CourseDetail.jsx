import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { formatDuration, formatRating, getDifficultyColor } from '../utils/filterHelper';
import { FiClock, FiBook, FiAward, FiPlay, FiClipboard, FiLock, FiArrowLeft } from 'react-icons/fi';
import StudentLayout from './StudentLayout';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { 
        getCourseById, 
        enrollInCourse, 
        getEnrollmentStatus,
        currentEnrollment 
    } = useDashboard();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch course details
                const courseResponse = await getCourseById(courseId);
                if (courseResponse.success) {
                    setCourse(courseResponse.data);
                }

                // Fetch enrollment status
                await getEnrollmentStatus(courseId);
            } catch (err) {
                console.error('Error fetching course details:', err);
                setError(err.message || 'Failed to load course');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchData();
        }
    }, [courseId, getCourseById, getEnrollmentStatus]);

    const handleEnroll = async () => {
        try {
            setEnrolling(true);
            await enrollInCourse(courseId);
            // Refresh enrollment status
            await getEnrollmentStatus(courseId);
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setError(err.message || 'Failed to enroll in course');
        } finally {
            setEnrolling(false);
        }
    };

    const handleStartContent = (contentId, type, item) => {
        if (!currentEnrollment) {
            setError('Please enroll in the course to access content');
            return;
        }
        
        // Clear any existing errors
        setError(null);
        
        // Get the actual content ID and ensure it's not null
        const actualContentId = item.contentId?._id || item.contentId;
        
        if (!actualContentId) {
            setError('Content not available');
            return;
        }

        console.log('Starting content:', { actualContentId, type, item });
        
        // Store current course state before navigation
        localStorage.setItem('lastCourseState', JSON.stringify({
            courseId,
            contentType: type,
            contentId: actualContentId
        }));
        
        try {
            if (type === 'video') {
                const videoId = item.contentId?._id || item.contentId;
                navigate(`/dashboard/videos/${videoId}`, { replace: false });
            } else if (type === 'quiz') {
                const quizId = item.contentId?._id || item.contentId;
                navigate(`/dashboard/quizzes/${quizId}`, { replace: false });
            }
        } catch (err) {
            console.error('Navigation error:', err);
            setError('Failed to open content');
        }
    };

    // Add cleanup effect
    useEffect(() => {
        return () => {
            // Clear any stored state when component unmounts
            localStorage.removeItem('lastCourseState');
        };
    }, []);

    // Add effect to handle back navigation
    useEffect(() => {
        const handlePopState = () => {
            // Refresh course data when navigating back
            if (courseId) {
                fetchData();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [courseId]);

    // Extract fetchData function to be reusable
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch course details
            const courseResponse = await getCourseById(courseId);
            if (courseResponse.success) {
                setCourse(courseResponse.data);
            }

            // Fetch enrollment status
            await getEnrollmentStatus(courseId);
        } catch (err) {
            console.error('Error fetching course details:', err);
            setError(err.message || 'Failed to load course');
        } finally {
            setLoading(false);
        }
    };

    // Move getContentStatus here
    const getContentStatus = (contentId) => {
        const progress = currentEnrollment?.contentProgress?.find(
            p => p.contentId.toString() === contentId
        );
        
        if (!progress) return 'Start';
        if (progress.completed) return 'Review';
        return `Continue (${progress.progress}%)`;
    };

    const handleBack = () => {
        navigate('/dashboard');  // Navigate back to dashboard
    };

    // ... existing loading and error states ...

    return (
        <StudentLayout>
            <div className="max-w-6xl mx-auto p-6">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={handleBack}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2"
                    >
                        <FiArrowLeft /> Back to Dashboard
                    </button>
                </div>

                {/* Course Header */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h1 className="text-3xl font-bold text-white mb-4">{course?.title}</h1>
                    <div className="flex flex-wrap gap-4 mb-4 text-white/60">
                        {/* ... existing course info ... */}
                    </div>
                    <p className="text-white/80 mb-6">{course?.description}</p>

                    {/* Enrollment Status & Progress */}
                    {currentEnrollment ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-white/60">
                                <span>Course Progress</span>
                                <span>{currentEnrollment.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                                    style={{ width: `${currentEnrollment.progress}%` }}
                                />
                            </div>
                            {currentEnrollment.isCompleted && (
                                <div className="text-center text-green-400 mt-2">
                                    Course Completed! 🎉
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                        >
                            {enrolling ? 'Enrolling...' : 'Enroll Now'}
                        </button>
                    )}
                </div>

                {/* Course Content */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                    <div className="space-y-4">
                        {course?.sequence?.map((item, index) => (
                            <div
                                key={index}
                                className={`bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 transition-all duration-300 ${
                                    currentEnrollment ? 'hover:bg-white/10 cursor-pointer' : 'opacity-75'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {item.contentType === 'video' ? (
                                            <FiPlay className="text-yellow-400" />
                                        ) : (
                                            <FiClipboard className="text-yellow-400" />
                                        )}
                                        <div>
                                            <h3 className="text-white font-medium">
                                                {item.contentId?.title || item.title}
                                            </h3>
                                            {item.duration && (
                                                <p className="text-white/60 text-sm">{item.duration}</p>
                                            )}
                                        </div>
                                    </div>
                                    {currentEnrollment ? (
                                        <button
                                            onClick={() => handleStartContent(item.contentId, item.contentType, item)}
                                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                        >
                                            {getContentStatus(item.contentId?._id || item.contentId)}
                                        </button>
                                    ) : (
                                        <FiLock className="text-white/40" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default CourseDetail; 