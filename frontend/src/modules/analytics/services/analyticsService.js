import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class AnalyticsService {
    constructor() {
        this.refreshAttempted = false;
        this.initializeInterceptor();
    }

    initializeInterceptor() {
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Only attempt refresh once and if it's a 401 error
                if (error.response?.status === 401 && !originalRequest._retry && !this.refreshAttempted) {
                    originalRequest._retry = true;
                    this.refreshAttempted = true;

                    try {
                        const token = localStorage.getItem('token')?.replace('Bearer ', '');
                        const refreshToken = localStorage.getItem('refreshToken');

                        if (!token || !refreshToken) {
                            throw new Error('No tokens available');
                        }

                        const response = await axios.post(
                            `${API_URL}/auth/refresh-token`,
                            {},
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'x-refresh-token': refreshToken,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        if (response.data.success && response.data.token) {
                            const newToken = response.data.token;
                            const newRefreshToken = response.data.refreshToken;

                            localStorage.setItem('token', `Bearer ${newToken}`);
                            localStorage.setItem('refreshToken', newRefreshToken);

                            // Update authorization header
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            this.refreshAttempted = false;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        this.refreshAttempted = false;
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login?session=expired';
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            'Authorization': token,
            'Content-Type': 'application/json'
        };
    }

    async getCourseAnalytics(courseId) {
        try {
            const response = await axios.get(
                `${API_URL}/analytics/course/${courseId}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Let the interceptor handle 401 errors
                throw error;
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }

    async downloadPDFReport(courseId) {
        try {
            const response = await axios.get(
                `${API_URL}/analytics/course/${courseId}/pdf`,
                { 
                    headers: this.getAuthHeaders(),
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Let the interceptor handle 401 errors
                throw error;
            }
            throw new Error('Failed to download PDF report');
        }
    }

    async downloadExcelReport(courseId) {
        try {
            const response = await axios.get(
                `${API_URL}/analytics/course/${courseId}/excel`,
                { 
                    headers: this.getAuthHeaders(),
                    responseType: 'blob'
                }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Let the interceptor handle 401 errors
                throw error;
            }
            throw new Error('Failed to download Excel report');
        }
    }

    async getOverallAnalytics() {
        try {
            const response = await axios.get(
                `${API_URL}/analytics/overview`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Let the interceptor handle 401 errors
                throw error;
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch overview analytics');
        }
    }

    async updateAnalytics(courseId, analyticsData) {
        try {
            const response = await axios.put(
                `${API_URL}/analytics/course/${courseId}`,
                analyticsData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Let the interceptor handle 401 errors
                throw error;
            }
            throw new Error(error.response?.data?.message || 'Failed to update analytics');
        }
    }
}

export default new AnalyticsService(); 