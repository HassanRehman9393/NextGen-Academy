import React, { useEffect } from 'react';
import { useVideo } from '../context/VideoContext';
import VideoList from './VideoList';
import VideoUploadForm from './VideoUploadForm';
import VideoEditForm from './VideoEditForm';
import { FaVideo, FaPlus, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';

const VideoDashboard = () => {
    const {
        videos,
        loading,
        error,
        selectedVideo,
        setSelectedVideo,
        isEditModalOpen,
        setIsEditModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        fetchVideos
    } = useVideo();

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <FaGraduationCap className="text-yellow-300 text-3xl animate-bounce" />
                                <span className="text-white text-xl font-bold">NextGen Academy</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-2 text-white/60">
                                <FaChalkboardTeacher className="text-yellow-300/60" />
                                <span>Instructor Dashboard</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FaPlus className="mr-2" />
                            Add New Video
                        </button>
                    </div>
                    
                    {/* Dashboard Title */}
                    <div className="px-6 py-8 bg-gradient-to-r from-white/5 to-transparent">
                        <h1 className="text-4xl font-bold text-white flex items-center mb-3">
                            <FaVideo className="mr-4 text-yellow-300" />
                            Video Management
                        </h1>
                        <p className="text-lg text-white/60 max-w-2xl">
                            Create and manage your educational content to inspire and educate your students
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-yellow-300 mb-4"></div>
                        <p className="text-white/60">Loading your content...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 px-4">
                        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-xl p-6 max-w-lg mx-auto">
                            <p className="text-red-200 text-lg">{error}</p>
                        </div>
                    </div>
                ) : (
                    <VideoList />
                )}
            </div>

            {/* Modals */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-4xl p-8 shadow-2xl transform transition-all duration-300">
                        <VideoUploadForm onClose={() => setIsUploadModalOpen(false)} />
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedVideo && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-2xl p-8 shadow-2xl transform transition-all duration-300">
                        <VideoEditForm
                            video={selectedVideo}
                            onClose={() => {
                                setSelectedVideo(null);
                                setIsEditModalOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoDashboard; 