import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class AnalyticsService {
    constructor() {
        // Add response interceptor for token refresh
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If error is 401 and we haven't tried refreshing token yet
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const token = localStorage.getItem('token');
                        const refreshToken = localStorage.getItem('refreshToken');

                        if (!token || !refreshToken) {
                            throw new Error('Authentication required');
                        }

                        // Try to refresh the token
                        const response = await axios.post(`${API_URL}/auth/refresh-token`, null, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'x-refresh-token': refreshToken
                            }
                        });

                        if (response.data.token) {
                            // Update stored tokens
                            localStorage.setItem('token', response.data.token);
                            if (response.data.refreshToken) {
                                localStorage.setItem('refreshToken', response.data.refreshToken);
                            }

                            // Update the failed request's authorization header
                            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
                            originalRequest.headers['x-refresh-token'] = response.data.refreshToken || refreshToken;

                            // Retry the original request
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        if (refreshError.response?.status === 401) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('refreshToken');
                            window.location.href = '/login?session=expired';
                        }
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!token || !refreshToken) {
            throw new Error('Authentication required');
        }

        return {
            'Authorization': `Bearer ${token}`,
            'x-refresh-token': refreshToken,
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
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login?session=expired';
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
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login?session=expired';
            }
            throw new Error(error.response?.data?.message || 'Failed to download PDF report');
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
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login?session=expired';
            }
            throw new Error(error.response?.data?.message || 'Failed to download Excel report');
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
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login?session=expired';
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch overview analytics');
        }
    }
}

export default new AnalyticsService(); 