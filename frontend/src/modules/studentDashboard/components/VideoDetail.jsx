import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import dashboardService from '../services/dashboardService';
import { formatDuration, formatViewCount } from '../utils/filterHelper';
import { FiClock, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const VideoDetail = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { getVideoById, loading, error } = useDashboard();
    const [video, setVideo] = useState(null);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);
    const progressInterval = useRef(null);

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                const data = await getVideoById(videoId);
                setVideo(data);
                if (data.progress) {
                    setProgress(data.progress);
                    if (videoRef.current) {
                        videoRef.current.currentTime = (data.progress / 100) * videoRef.current.duration;
                    }
                }
            } catch (err) {
                console.error('Error fetching video:', err);
            }
        };

        fetchVideoDetails();

        // Cleanup progress tracking interval
        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [videoId, getVideoById]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(Math.round(currentProgress));
        }
    };

    const startProgressTracking = () => {
        progressInterval.current = setInterval(async () => {
            if (videoRef.current) {
                const currentProgress = Math.round((videoRef.current.currentTime / videoRef.current.duration) * 100);
                await dashboardService.updateVideoProgress(videoId, currentProgress);
            }
        }, 5000); // Update progress every 5 seconds
    };

    const handleVideoEnd = async () => {
        await dashboardService.markVideoComplete(videoId);
        if (video.nextContent) {
            navigate(`/dashboard/${video.nextContent.type}s/${video.nextContent._id}`);
        }
    };

    const navigateContent = (content) => {
        if (content) {
            navigate(`/dashboard/${content.type}s/${content._id}`);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!video) return <div className="text-center p-4">Video not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden mb-6">
                <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={startProgressTracking}
                    onEnded={handleVideoEnd}
                    poster={video.thumbnail}
                >
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                    <span className="flex items-center gap-2">
                        <FiClock className="text-gray-500" />
                        {formatDuration(video.duration)}
                    </span>
                    <span className="flex items-center gap-2">
                        <FiEye className="text-gray-500" />
                        {formatViewCount(video.viewCount)} views
                    </span>
                </div>
                <p className="text-gray-600 mb-6">{video.description}</p>

                {/* Progress Bar */}
                <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Video Progress</span>
                        <span className="text-blue-600 font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => navigateContent(video.previousContent)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        video.previousContent
                            ? 'bg-gray-100 hover:bg-gray-200'
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!video.previousContent}
                >
                    <FiChevronLeft />
                    Previous
                </button>
                <button
                    onClick={() => navigateContent(video.nextContent)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        video.nextContent
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!video.nextContent}
                >
                    Next
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

export default VideoDetail; 