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

        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in localStorage');
                    window.location.href = '/login';
                    return Promise.reject(new Error('No authentication token'));
                }

                const cleanToken = token.replace('Bearer ', '');
                config.headers['Authorization'] = `Bearer ${cleanToken}`;
                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
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
                            refreshToken: refreshToken.replace('Bearer ', '')
                        });

                        if (response.data.success) {
                            const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
                            
                            localStorage.setItem('token', newToken);
                            localStorage.setItem('refreshToken', newRefreshToken);

                            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                            return this.axiosInstance(originalRequest);
                        } else {
                            throw new Error('Token refresh failed');
                        }
                    } catch (refreshError) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async makeRequest(method, endpoint, data = null, params = null) {
        try {
            const config = {
                method,
                url: endpoint,
                ...(data && { data }),
                ...(params && { params })
            };

            const response = await this.axiosInstance(config);
            
            if (!response.data.success) {
                throw new Error(response.data.message || 'Request failed');
            }

            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw error;
            }
            throw new Error(error.response?.data?.message || 'Request failed');
        }
    }

    async getCourses(params = {}) {
        try {
            const queryParams = {
                page: params.page || 1,
                limit: params.limit || 12,
                sortBy: params.sortBy || 'createdAt',
                sortOrder: params.sortOrder || 'desc'
            };

            if (params.search) queryParams.search = params.search;
            if (params.category) queryParams.category = params.category;
            if (params.difficultyLevel) queryParams.difficultyLevel = params.difficultyLevel;
            if (params.minRating) queryParams.minRating = params.minRating;

            const result = await this.makeRequest('GET', '/dashboard/courses', null, queryParams);
            return result;
        } catch (error) {
            console.error('Error in getCourses:', error);
            throw error;
        }
    }

    async getVideos(params = {}) {
        try {
            const queryParams = {
                page: params.page || 1,
                limit: params.limit || 12,
                sortBy: params.sortBy || 'createdAt',
                sortOrder: params.sortOrder || 'desc'
            };

            if (params.search) queryParams.search = params.search;
            if (params.category) queryParams.category = params.category;

            const result = await this.makeRequest('GET', '/dashboard/videos', null, queryParams);
            return result;
        } catch (error) {
            console.error('Error in getVideos:', error);
            throw error;
        }
    }

    async getCourseById(courseId) {
        return this.makeRequest('GET', `/dashboard/courses/${courseId}`);
    }

    async getVideoById(videoId) {
        return this.makeRequest('GET', `/dashboard/videos/${videoId}`);
    }

    async enrollInCourse(courseId) {
        return this.makeRequest('POST', `/dashboard/courses/${courseId}/enroll`);
    }

    async getCourseProgress(courseId) {
        return this.makeRequest('GET', `/dashboard/courses/${courseId}/progress`);
    }

    async updateVideoProgress(videoId, progress) {
        return this.makeRequest('POST', `/dashboard/videos/${videoId}/progress`, { progress });
    }

    async markVideoComplete(videoId) {
        return this.makeRequest('POST', `/dashboard/videos/${videoId}/complete`);
    }
}

export default new DashboardService(); 