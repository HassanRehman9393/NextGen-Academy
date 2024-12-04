import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class ForumService {
    constructor() {
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

    async fetchForums(page = 1, limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/discussion/my-forums`, {
                params: { page, limit },
                headers: this.getAuthHeaders()
            });
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to fetch forums');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error fetching forums:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch forums');
        }
    }

    async createForum(forumData) {
        try {
            const response = await axios.post(`${API_URL}/discussion/create`, forumData, {
                headers: this.getAuthHeaders()
            });

            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to create forum');
            }

            return response.data;
        } catch (error) {
            console.error('Error creating forum:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create forum';
            throw new Error(errorMessage);
        }
    }

    async getForumDetails(forumId) {
        try {
            const response = await axios.get(`${API_URL}/discussion/${forumId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching forum details:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch forum details');
        }
    }

    async addReply(forumId, commentId, replyData) {
        try {
            const response = await axios.post(
                `${API_URL}/discussion/${forumId}/comments/${commentId}/reply`,
                replyData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding reply:', error);
            throw new Error(error.response?.data?.message || 'Failed to add reply');
        }
    }

    async updateForum(forumId, updateData) {
        try {
            const response = await axios.put(
                `${API_URL}/discussion/${forumId}`,
                updateData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating forum:', error);
            throw new Error(error.response?.data?.message || 'Failed to update forum');
        }
    }

    async deleteForum(forumId) {
        try {
            const response = await axios.delete(`${API_URL}/discussion/${forumId}`, {
                headers: this.getAuthHeaders()
            });

            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to delete forum');
            }

            return response.data;
        } catch (error) {
            console.error('Error deleting forum:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete forum');
        }
    }

    async editForum(forumId, forumData) {
        try {
            const response = await axios.put(`${API_URL}/discussion/${forumId}`, forumData, {
                headers: this.getAuthHeaders()
            });

            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to update forum');
            }

            return response.data;
        } catch (error) {
            console.error('Error updating forum:', error);
            throw new Error(error.response?.data?.message || 'Failed to update forum');
        }
    }
}

// Export a single instance
const forumService = new ForumService();
export default forumService; 