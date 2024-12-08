import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class CourseService {
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

    async getCourses() {
        try {
            const response = await axios.get(
                `${API_URL}/courses`,
                { 
                    headers: this.getAuthHeaders(),
                    skipAuthRefresh: false // Allow refresh attempt for this request
                }
            );
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Let the interceptor handle 401 errors
                throw error;
            }
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

    async getInstructorCourses() {
        try {
            const response = await axios.get(
                `${API_URL}/courses/instructor/courses`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching instructor courses:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch instructor courses');
        }
    }
}

export default new CourseService(); 