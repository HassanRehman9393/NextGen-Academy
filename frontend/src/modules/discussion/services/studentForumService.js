import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class StudentForumService {
    async getAllForums(page = 1, limit = 10, courseId = null) {
        try {
            const params = { page, limit };
            if (courseId) params.courseId = courseId;

            const response = await axios.get(`${API_URL}/discussion/student/forums`, {
                params,
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch forums');
        }
    }

    async getForumDetails(forumId) {
        try {
            const response = await axios.get(
                `${API_URL}/discussion/student/forums/${forumId}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch forum details');
        }
    }

    async addComment(forumId, content) {
        try {
            const response = await axios.post(
                `${API_URL}/discussion/student/forums/${forumId}/comments`,
                { content },
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add comment');
        }
    }

    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': token,
            'Content-Type': 'application/json'
        };
    }
}

export default new StudentForumService(); 