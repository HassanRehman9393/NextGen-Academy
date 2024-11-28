import React, { useEffect } from 'react';
import { useVideo } from '../context/VideoContext';
import { FaEdit, FaTrash, FaYoutube, FaCalendar, FaFolder, FaPlay, FaVideo, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../../auth/hooks/useAuth';

const VideoList = () => {
    const { 
        videos, 
        handleVideoDelete, 
        setSelectedVideo, 
        setIsEditModalOpen,
        setIsUploadModalOpen,
        setIsDeleteModalOpen,
        setVideoToDelete,
        isDeleteModalOpen,
        videoToDelete
    } = useVideo();
    const { user } = useAuth();

    const getYoutubeEmbedUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? 
            `https://www.youtube.com/embed/${match[2]}` : 
            url;
    };

    const handleEdit = (video) => {
        setSelectedVideo(video);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (video) => {
        setVideoToDelete(video);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await handleVideoDelete(videoToDelete._id);
            setIsDeleteModalOpen(false);
            setVideoToDelete(null);
        } catch (error) {
            console.error('Failed to delete video:', error);
        }
    };

    if (!videos?.length) {
        return (
            <div className="text-center py-16">
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-12 max-w-lg mx-auto transform hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <FaVideo className="text-yellow-300 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Videos Available</h3>
                    <p className="text-white/60 text-lg mb-6">Start building your course by adding your first educational video</p>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 transition duration-300 shadow-lg hover:shadow-xl"
                    >
                        <FaPlus className="inline-block mr-2" />
                        Add Your First Video
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                    <div key={video._id} 
                        className="group bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        {/* Video Player */}
                        <div className="aspect-video relative group">
                            {video.type === 'youtube' ? (
                                <iframe
                                    src={getYoutubeEmbedUrl(video.url)}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={video.title}
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <video
                                        src={video.url}
                                        controls
                                        className="w-full h-full object-cover"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <FaPlay className="text-white text-4xl transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                                    </div>
                                </div>
                            )}
                            <div className="absolute top-3 right-3 flex space-x-2">
                                {video.type === 'youtube' && (
                                    <span className="bg-red-500/20 backdrop-blur-md px-3 py-1 rounded-full text-red-400 text-sm font-medium flex items-center">
                                        <FaYoutube className="mr-1" />
                                        YouTube
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition duration-300">
                                {video.title}
                            </h3>
                            <p className="text-white/60 text-sm mb-6 line-clamp-2">
                                {video.description}
                            </p>
                            
                            {/* Meta Information */}
                            <div className="flex items-center space-x-4 mb-6 text-sm text-white/40">
                                <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                                    <FaCalendar className="mr-2 text-yellow-300/60" />
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                                    <FaFolder className="mr-2 text-yellow-300/60" />
                                    {video.category}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => handleEdit(video)}
                                    className="px-4 py-2 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 transition duration-200 flex items-center"
                                    title="Edit"
                                >
                                    <FaEdit className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(video)}
                                    className="px-4 py-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition duration-200 flex items-center"
                                    title="Delete"
                                >
                                    <FaTrash className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && videoToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-md p-8 shadow-2xl transform transition-all duration-300">
                        <div className="text-center">
                            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-400 text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Delete Video</h3>
                            <p className="text-white/60 mb-6">
                                Are you sure you want to delete "{videoToDelete.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setVideoToDelete(null);
                                    }}
                                    className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition duration-200"
                                >
                                    Delete Video
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoList; 