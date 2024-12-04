import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaClock, FaGraduationCap, FaTag, FaPlayCircle } from 'react-icons/fa';

const VideoCard = ({ video }) => {
    const {
        _id,
        title,
        description,
        uploadedBy,
        duration,
        viewCount = 0,
        uploadType,
        category,
        progress,
        url
    } = video;

    // Function to get YouTube thumbnail
    const getYouTubeThumbnail = (url) => {
        if (!url) return null;
        const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
        return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : null;
    };

    const thumbnail = getYouTubeThumbnail(url);

    return (
        <Link
            to={`/dashboard/videos/${_id}`}
            className="block group"
        >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-yellow-300/30 hover:scale-[1.02] hover:shadow-xl">
                {/* Video Preview */}
                <div className="relative aspect-video">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <FaPlayCircle className="text-4xl text-white/30" />
                        </div>
                    )}
                    
                    {/* Duration Badge */}
                    {duration && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-white/90 text-xs backdrop-blur-sm">
                            {duration}
                        </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="transform scale-0 group-hover:scale-100 transition-transform duration-200">
                            <FaPlayCircle className="text-4xl text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-white line-clamp-1 flex-1">
                            {title}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-blue-400/10 text-blue-400 rounded-full border border-blue-400/20 capitalize ml-2 whitespace-nowrap">
                            {category || uploadType || 'Video'}
                        </span>
                    </div>

                    {/* Instructor */}
                    <p className="text-sm text-white/70 flex items-center mb-3">
                        <FaGraduationCap className="mr-2" />
                        {uploadedBy?.firstName} {uploadedBy?.lastName}
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-sm line-clamp-2 mb-3">
                        {description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-white/60 text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <FaEye className="mr-1" />
                                <span>{viewCount} views</span>
                            </div>
                            {duration && (
                                <div className="flex items-center">
                                    <FaClock className="mr-1" />
                                    <span>{duration}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar (if started) */}
                    {progress !== undefined && (
                        <div className="mt-3">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-yellow-300 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-white/60 mt-1">
                                {progress}% Watched
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default VideoCard; 