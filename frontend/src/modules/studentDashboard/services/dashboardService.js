import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class DashboardService {
    constructor() {
        this.baseURL = `${API_URL}/dashboard`;
        this.initializeAxios();
    }

    initializeAxios() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = token;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Get all courses
    async getAllCourses(params = {}) {
        try {
            console.log('Getting all courses with params:', params);
            const response = await this.axiosInstance.get('/dashboard/courses/all', { params });
            console.log('Response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch courses');
            }
            
            return {
                data: {
                    data: response.data.data || [],
                    pagination: response.data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0
                    }
                }
            };
        } catch (error) {
            console.error('Error getting all courses:', error);
            throw error;
        }
    }

    // Search courses
    async searchCourses(params = {}) {
        try {
            console.log('Searching courses with params:', params);
            const response = await this.axiosInstance.get('/dashboard/courses/search', { params });
            console.log('Search response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to search courses');
            }
            
            return {
                data: {
                    data: response.data.data || [],
                    pagination: response.data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0
                    }
                }
            };
        } catch (error) {
            console.error('Error searching courses:', error);
            throw error;
        }
    }

    // Get all videos
    async getAllVideos(params = {}) {
        try {
            console.log('Getting all videos with params:', params);
            const response = await this.axiosInstance.get('/dashboard/videos/all', { params });
            console.log('Response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch videos');
            }
            
            return {
                data: {
                    data: response.data.data || [],
                    pagination: response.data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0
                    }
                }
            };
        } catch (error) {
            console.error('Error getting all videos:', error);
            throw error;
        }
    }

    // Search videos
    async searchVideos(params = {}) {
        try {
            console.log('Searching videos with params:', params);
            const response = await this.axiosInstance.get('/dashboard/videos/search', { params });
            console.log('Search response:', response.data);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to search videos');
            }
            
            return {
                data: {
                    data: response.data.data || [],
                    pagination: response.data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0
                    }
                }
            };
        } catch (error) {
            console.error('Error searching videos:', error);
            throw error;
        }
    }

    async getCourseById(courseId) {
        try {
            const response = await this.axiosInstance.get(`/dashboard/courses/${courseId}`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch course');
            }
            return response.data;
        } catch (error) {
            console.error('Error getting course by ID:', error);
            throw error;
        }
    }

    async getVideoById(videoId) {
        try {
            const response = await this.axiosInstance.get(`/dashboard/videos/${videoId}`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch video');
            }
            return response.data;
        } catch (error) {
            console.error('Error getting video by ID:', error);
            throw error;
        }
    }

    async updateVideoProgress(videoId, progress) {
        try {
            const response = await this.axiosInstance.post(`/dashboard/videos/${videoId}/progress`, { progress });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update video progress');
            }
            return response.data;
        } catch (error) {
            console.error('Error updating video progress:', error);
            throw error;
        }
    }

    async markVideoComplete(videoId) {
        try {
            const response = await this.axiosInstance.post(`/dashboard/videos/${videoId}/complete`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to mark video as complete');
            }
            return response.data;
        } catch (error) {
            console.error('Error marking video as complete:', error);
            throw error;
        }
    }

    async getCourseProgress(courseId) {
        try {
            const response = await this.axiosInstance.get(`/dashboard/courses/${courseId}/progress`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to get course progress');
            }
            return response.data;
        } catch (error) {
            console.error('Error getting course progress:', error);
            throw error;
        }
    }

    async enrollInCourse(courseId) {
        try {
            const response = await this.axiosInstance.post(`/dashboard/courses/${courseId}/enroll`);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to enroll in course');
            }
            return response.data;
        } catch (error) {
            console.error('Error enrolling in course:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const dashboardService = new DashboardService();

// Export the instance
export default dashboardService; 