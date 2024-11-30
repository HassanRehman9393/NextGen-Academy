import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class QuizService {
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

    async getQuizzes() {
        try {
            const response = await axios.get(`${API_URL}/quizzes`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error getting quizzes:', error);
            throw error;
        }
    }

    async createQuiz(quizData) {
        try {
            const response = await axios.post(`${API_URL}/quizzes`, quizData, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw new Error(error.response?.data?.message || 'Failed to create quiz');
        }
    }

    async updateQuiz(quizId, quizData) {
        try {
            const response = await axios.put(`${API_URL}/quizzes/${quizId}`, quizData, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw new Error(error.response?.data?.message || 'Failed to update quiz');
        }
    }

    async deleteQuiz(quizId) {
        try {
            const response = await axios.delete(`${API_URL}/quizzes/${quizId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete quiz');
        }
    }

    async getQuizQuestions(quizId) {
        try {
            console.log('Fetching questions for quiz:', quizId); // Debug log
            const response = await axios.get(`${API_URL}/quizzes/${quizId}/questions`, {
                headers: this.getAuthHeaders()
            });
            console.log('Questions API response:', response); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error getting questions:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch questions');
        }
    }

    async addQuestion(quizId, questionData) {
        try {
            const response = await axios.post(
                `${API_URL}/quizzes/${quizId}/questions`,
                questionData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding question:', error);
            throw new Error(error.response?.data?.message || 'Failed to add question');
        }
    }

    async updateQuestion(questionId, questionData) {
        try {
            console.log('Updating question:', questionId, questionData);
            const response = await axios.put(
                `${API_URL}/quizzes/questions/${questionId}`,
                questionData,
                { headers: this.getAuthHeaders() }
            );
            console.log('Update response:', response);
            return response.data;
        } catch (error) {
            console.error('Error updating question:', error);
            throw new Error(error.response?.data?.message || 'Failed to update question');
        }
    }

    async deleteQuestion(questionId) {
        try {
            console.log('Deleting question:', questionId);
            const response = await axios.delete(
                `${API_URL}/quizzes/questions/${questionId}`,
                { headers: this.getAuthHeaders() }
            );
            console.log('Delete response:', response);
            return response.data;
        } catch (error) {
            console.error('Error deleting question:', error);
            throw new Error(error.response?.data?.message || 'Failed to delete question');
        }
    }
}

// Export a single instance
const quizService = new QuizService();
export default quizService; 