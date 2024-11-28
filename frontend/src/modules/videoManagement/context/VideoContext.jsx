import React, { createContext, useContext, useState } from 'react';
import { useVideoManagement } from '../hooks/useVideoManagement.ts';


const VideoContext = createContext();

export const useVideo = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
};

export const VideoProvider = ({ children }) => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);

    const {
        videos,
        loading,
        error,
        fetchVideos,
        handleVideoUpload,
        handleYoutubeAdd,
        handleVideoDelete,
        handleVideoUpdate
    } = useVideoManagement();

    const value = {
        videos,
        loading,
        error,
        selectedVideo,
        setSelectedVideo,
        isEditModalOpen,
        setIsEditModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        videoToDelete,
        setVideoToDelete,
        fetchVideos,
        handleVideoUpload,
        handleYoutubeAdd,
        handleVideoDelete,
        handleVideoUpdate
    };

    return (
        <VideoContext.Provider value={value}>
            {children}
        </VideoContext.Provider>
    );
}; 