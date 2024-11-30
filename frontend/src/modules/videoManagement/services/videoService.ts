import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const CLOUDINARY_CLOUD_NAME = 'dj2xeustv';
const CLOUDINARY_UPLOAD_PRESET = 'NextGenAcademy';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

interface VideoData {
    title: string;
    description: string;
    category: string;
    type: 'file' | 'youtube';
    url?: string;
    youtubeUrl?: string;
    file?: File;
}

class VideoService {
    constructor() {
        // Add response interceptor for token refresh
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (!refreshToken) {
                            throw new Error('No refresh token available');
                        }

                        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                            refreshToken
                        });

                        if (response.data?.success) {
                            const { token, refreshToken: newRefreshToken } = response.data.data;

                            localStorage.setItem('token', `Bearer ${token}`);
                            localStorage.setItem('refreshToken', newRefreshToken);

                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        localStorage.clear();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }
    
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }
        return {
            'Authorization': token,
            'Content-Type': 'application/json'
        };
    }

    async uploadToCloudinary(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'instructor_videos');
        formData.append('resource_type', 'video');
    
        try {
            const cloudinaryAxios = axios.create();
            delete cloudinaryAxios.defaults.headers.common['Authorization'];
    
            const response = await cloudinaryAxios.post(CLOUDINARY_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: false,
            });
    
            if (!response.data || !response.data.secure_url) {
                throw new Error('Invalid response from Cloudinary');
            }
    
            return response.data.secure_url;
        } catch (error: any) {
            console.error('Cloudinary upload error:', error.response?.data || error);
            const errorMessage = error.response?.data?.error?.message || 'Failed to upload file to cloud storage';
            throw new Error(errorMessage);
        }
    }
    

    async uploadVideo(videoData: VideoData) {
        try {
            let url = videoData.url;
    
            if (videoData.file) {
                url = await this.uploadToCloudinary(videoData.file);
            }
    
            const payload = {
                title: videoData.title,
                description: videoData.description,
                category: videoData.category,
                type: 'file',
                videoUrl: url
            };
    
            console.log('Sending request to:', `${API_URL}/videos/upload`);
            console.log('With payload:', payload);
            console.log('And headers:', this.getAuthHeaders());
    
            const response = await axios.post(`${API_URL}/videos/upload`, payload, {
                headers: this.getAuthHeaders()
            });
    
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to upload video');
            }
    
            return response.data;
        } catch (error: any) {
            console.error('Full error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload video';
            throw new Error(errorMessage);
        }
    }
    

    async addYoutubeVideo(videoData: VideoData) {
        try {
            const payload = {
                title: videoData.title,
                description: videoData.description,
                category: videoData.category,
                youtubeUrl: videoData.youtubeUrl
            };

            const response = await axios.post(`${API_URL}/videos/youtube`, payload, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            console.error('YouTube error:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Failed to add YouTube video');
        }
    }

    async getVideos() {
        try {
            const response = await axios.get(`${API_URL}/videos`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // Handle token expiration specifically for video requests
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    try {
                        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {
                            refreshToken
                        });
                        if (refreshResponse.data?.success) {
                            // Retry the original request
                            return this.getVideos();
                        }
                    } catch (refreshError) {
                        console.error('Failed to refresh token:', refreshError);
                        localStorage.clear();
                        window.location.href = '/login';
                    }
                }
            }
            console.error('Error getting videos:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch videos');
        }
    }

    async updateVideo(videoId: string, videoData: Partial<VideoData>) {
        try {
            const response = await axios.put(`${API_URL}/videos/${videoId}`, videoData, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update video');
        }
    }

    async deleteVideo(videoId: string) {
        try {
            const response = await axios.delete(`${API_URL}/videos/${videoId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete video');
        }
    }
}

// Create and export a single instance
const videoService = new VideoService();
export default videoService; 