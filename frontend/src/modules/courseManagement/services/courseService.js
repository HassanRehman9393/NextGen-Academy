import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class CourseService {
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

    async getCourses() {
        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch courses');
        }
    }

    async createCourse(courseData) {
        try {
            const response = await axios.post(`${API_URL}/courses`, courseData, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create course');
        }
    }

    async updateCourse(courseId, courseData) {
        try {
            const response = await axios.put(`${API_URL}/courses/${courseId}`, courseData, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update course');
        }
    }

    async deleteCourse(courseId) {
        try {
            const response = await axios.delete(`${API_URL}/courses/${courseId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete course');
        }
    }

    async addContent(courseId, contentData) {
        if (!courseId) {
            throw new Error('Course ID is required');
        }

        try {
            console.log('Making API call to add content:', { courseId, contentData });

            const response = await axios.post(
                `${API_URL}/courses/${courseId}/content`,
                contentData,
                { headers: this.getAuthHeaders() }
            );

            console.log('API response:', response);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to add content');
            }

            return response.data;
        } catch (error) {
            console.error('API error:', error.response || error);
            throw new Error(error.response?.data?.message || 'Failed to add content');
        }
    }

    async removeContent(courseId, contentIndex) {
        try {
            const response = await axios.delete(
                `${API_URL}/courses/${courseId}/content/${contentIndex}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to remove content');
        }
    }

    async reorderContent(courseId, fromIndex, toIndex) {
        try {
            const response = await axios.put(
                `${API_URL}/courses/${courseId}/content/reorder`,
                { fromIndex, toIndex },
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to reorder content');
        }
    }
}

export default new CourseService(); 