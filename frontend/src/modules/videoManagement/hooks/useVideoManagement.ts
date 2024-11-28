import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import VideoService from '../services/videoService.ts';

export const useVideoManagement = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.log('No user data found in localStorage');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            console.log('Fetching videos with stored user:', JSON.parse(storedUser));
            const response = await VideoService.getVideos();
            console.log('API Response:', response);
            
            if (response.success && Array.isArray(response.data)) {
                setVideos(response.data);
            } else {
                console.error('Invalid response format:', response);
                setVideos([]);
            }
        } catch (err: any) {
            console.error('Error fetching videos:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch videos when component mounts
    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleVideoUpload = async (videoData: any) => {
        setLoading(true);
        setError(null);
        try {
            await VideoService.uploadVideo(videoData);
            await fetchVideos();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleYoutubeAdd = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await VideoService.addYoutubeVideo(data);
            await fetchVideos();
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to add YouTube video';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoDelete = async (videoId: string) => {
        setLoading(true);
        setError(null);
        try {
            await VideoService.deleteVideo(videoId);
            await fetchVideos();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpdate = async (videoId: string, data: any) => {
        setLoading(true);
        setError(null);
        try {
            await VideoService.updateVideo(videoId, data);
            await fetchVideos();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        videos,
        loading,
        error,
        fetchVideos,
        handleVideoUpload,
        handleYoutubeAdd,
        handleVideoDelete,
        handleVideoUpdate
    };
}; 