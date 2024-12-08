import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class RatingManagementService {
    constructor() {
        this.refreshAttempted = false;
        this.initializeInterceptor();
    }

    initializeInterceptor() {
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

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
                            localStorage.setItem('token', `Bearer ${response.data.token}`);
                            localStorage.setItem('refreshToken', response.data.refreshToken);
                            originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
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

    async getCourseRatings(courseId) {
        try {
            console.log('Service: Fetching ratings for course:', courseId);
            const response = await axios.get(
                `${API_URL}/instructor/ratings/course/${courseId}/ratings`,
                { headers: this.getAuthHeaders() }
            );
            console.log('Service: Ratings response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Service: Error fetching ratings:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch ratings');
        }
    }

    async respondToRating(ratingId, response) {
        try {
            const result = await axios.post(
                `${API_URL}/instructor/ratings/ratings/${ratingId}/respond`,
                { response },
                { headers: this.getAuthHeaders() }
            );
            return result.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to respond to rating');
        }
    }

    async deleteResponse(responseId) {
        try {
            const response = await axios.delete(
                `${API_URL}/instructor/ratings/responses/${responseId}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete response');
        }
    }

    async getRatingAnalytics(courseId) {
        try {
            const response = await axios.get(
                `${API_URL}/instructor/ratings/course/${courseId}/rating-analytics`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch rating analytics');
        }
    }
}

export default new RatingManagementService(); 