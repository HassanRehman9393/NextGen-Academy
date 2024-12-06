import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { FiClock, FiUser, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import StudentLayout from './StudentLayout';

const VideoDetail = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { 
        getVideoById, 
        updateProgress,
        getEnrollmentStatus,
        currentEnrollment 
    } = useDashboard();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseId, setCourseId] = useState(null);
    const videoRef = useRef(null);
    const progressInterval = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!videoId) {
                    throw new Error('Video ID is required');
                }

                const videoResponse = await getVideoById(videoId);
                console.log('Video response:', videoResponse);

                if (videoResponse) {
                    setVideo(videoResponse);
                    if (videoResponse.courseId) {
                        setCourseId(videoResponse.courseId);
                        await getEnrollmentStatus(videoResponse.courseId);
                    }
                } else {
                    throw new Error('Failed to load video data');
                }
            } catch (err) {
                console.error('Error fetching video:', err);
                setError(err.message || 'Failed to load video');
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchData();
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [videoId, getVideoById, getEnrollmentStatus]);

    const handleTimeUpdate = async () => {
        if (!videoRef.current || !courseId) return;

        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const progress = Math.round((currentTime / duration) * 100);
        const completed = progress === 100;

        try {
            if (progress % 5 === 0 || completed) {
                console.log('Updating video progress:', progress);
                const response = await updateProgress(courseId, videoId, {
                    progress,
                    completed,
                    contentType: 'video'
                });

                if (response.success) {
                    await getEnrollmentStatus(courseId);
                }
            }
        } catch (err) {
            console.error('Error updating progress:', err);
        }
    };

    useEffect(() => {
        if (!videoRef.current || !courseId) return;

        progressInterval.current = setInterval(handleTimeUpdate, 3000);

        const handleVideoEnd = async () => {
            try {
                await updateProgress(courseId, videoId, {
                    progress: 100,
                    completed: true,
                    contentType: 'video'
                });
                await getEnrollmentStatus(courseId);
            } catch (err) {
                console.error('Error updating final progress:', err);
            }
        };

        videoRef.current.addEventListener('ended', handleVideoEnd);

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
            if (videoRef.current) {
                videoRef.current.removeEventListener('ended', handleVideoEnd);
            }
        };
    }, [courseId, videoId, updateProgress, getEnrollmentStatus]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
                    <div className="ml-4 text-white">Loading video...</div>
                </div>
            </StudentLayout>
        );
    }

    if (error) {
        return (
            <StudentLayout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-yellow-400 hover:text-yellow-300"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </StudentLayout>
        );
    }

    if (!video) {
        return (
            <StudentLayout>
                <div className="text-center text-white py-8">Video not found</div>
            </StudentLayout>
        );
    }

    const videoProgress = currentEnrollment?.contentProgress?.find(
        p => p.contentId.toString() === videoId
    );

    return (
        <StudentLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={handleBack}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2"
                    >
                        <FiArrowLeft /> Back to Course
                    </button>
                </div>

                {/* Video Player */}
                <div className="bg-black rounded-xl overflow-hidden mb-8">
                    {video.url.includes('youtube.com') ? (
                        <iframe
                            className="w-full aspect-video"
                            src={`https://www.youtube.com/embed/${video.url.split('v=')[1]}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <video
                            ref={videoRef}
                            className="w-full aspect-video"
                            controls
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleTimeUpdate}
                            poster={video.thumbnail}
                        >
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                {/* Progress Bar */}
                {videoProgress && (
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60">Progress</span>
                            <span className="text-white/60">{videoProgress.progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                                style={{ width: `${videoProgress.progress}%` }}
                            />
                        </div>
                        {videoProgress.completed && (
                            <div className="text-center text-green-400 mt-2">
                                Video Completed! 🎉
                            </div>
                        )}
                    </div>
                )}

                {/* Video Info */}
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {video.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-white/60 mb-6">
                        {video.uploadedBy && (
                            <div className="flex items-center">
                                <FiUser className="mr-2" />
                                <span>
                                    {video.uploadedBy.firstName} {video.uploadedBy.lastName}
                                </span>
                            </div>
                        )}
                        {video.duration && (
                            <div className="flex items-center">
                                <FiClock className="mr-2" />
                                <span>{video.duration}</span>
                            </div>
                        )}
                        {video.createdAt && (
                            <div className="flex items-center">
                                <FiCalendar className="mr-2" />
                                <span>
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                    {video.description && (
                        <div className="text-white/80">
                            <p>{video.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
};

export default VideoDetail; 