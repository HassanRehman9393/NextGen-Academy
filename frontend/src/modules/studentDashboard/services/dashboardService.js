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
            console.log('Service: Fetching course with ID:', courseId);
            const response = await this.axiosInstance.get(`/dashboard/courses/${courseId}`);
            console.log('Service: Raw response:', response);
            
            if (!response || !response.data) {
                console.error('Service: No response data received');
                throw new Error('No course data received');
            }

            console.log('Service: Returning course data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service: Error getting course by ID:', error);
            throw error;
        }
    }

    async getVideoById(videoId) {
        try {
            console.log('Service: Fetching video with ID:', videoId);
            const response = await this.axiosInstance.get(`/dashboard/videos/${videoId}`);
            console.log('Service: Raw response:', response);
            
            if (!response || !response.data) {
                console.error('Service: No response data received');
                throw new Error('No video data received');
            }

            console.log('Service: Returning video data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service: Error getting video by ID:', error);
            throw error;
        }
    }

    async enrollInCourse(courseId) {
        try {
            console.log('Enrolling in course:', courseId);
            const response = await this.axiosInstance.post(`/enrollment/courses/${courseId}/enroll`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to enroll in course');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error enrolling in course:', error);
            throw error;
        }
    }

    async updateContentProgress(courseId, contentId, progressData) {
        try {
            console.log('Updating content progress:', { courseId, contentId, progressData });
            const response = await this.axiosInstance.post(
                `/enrollment/courses/${courseId}/content/${contentId}/progress`,
                progressData
            );
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update progress');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error updating progress:', error);
            throw error;
        }
    }

    async getEnrollmentStatus(courseId) {
        try {
            console.log('Getting enrollment status for course:', courseId);
            const response = await this.axiosInstance.get(`/enrollment/courses/${courseId}/enrollment`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to get enrollment status');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error getting enrollment status:', error);
            throw error;
        }
    }

    async getStudentEnrollments() {
        try {
            console.log('Getting all enrollments');
            const response = await this.axiosInstance.get('/enrollment/enrollments');
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to get enrollments');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error getting enrollments:', error);
            throw error;
        }
    }

    async getQuizById(quizId) {
        try {
            console.log('Service: Fetching quiz with ID:', quizId);
            const response = await this.axiosInstance.get(`/dashboard/quizzes/${quizId}`);
            console.log('Service: Raw response:', response);
            
            if (!response || !response.data) {
                console.error('Service: No response data received');
                throw new Error('No quiz data received');
            }

            console.log('Service: Returning quiz data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service: Error getting quiz by ID:', error);
            throw error;
        }
    }

    async submitQuizAttempt(quizId, answers) {
        try {
            console.log('Service: Submitting quiz attempt:', { quizId, answers });
            const response = await this.axiosInstance.post(`/dashboard/quizzes/${quizId}/submit`, {
                answers
            });
            
            if (!response || !response.data) {
                console.error('Service: No response data received');
                throw new Error('Failed to submit quiz');
            }

            console.log('Service: Quiz submission response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service: Error submitting quiz:', error);
            throw error;
        }
    }

    async getQuizProgress(quizId) {
        try {
            console.log('Service: Getting quiz progress:', quizId);
            const response = await this.axiosInstance.get(`/dashboard/quizzes/${quizId}/progress`);
            
            if (!response || !response.data) {
                console.error('Service: No response data received');
                throw new Error('Failed to get quiz progress');
            }

            console.log('Service: Quiz progress response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service: Error getting quiz progress:', error);
            throw error;
        }
    }

}

// Create a singleton instance
const dashboardService = new DashboardService();

// Export the instance
export default dashboardService; 