import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class StudentForumService {
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

    async getAllForums(page = 1, limit = 10, courseId = null) {
        try {
            const params = { page, limit };
            if (courseId) {
                params.courseId = courseId;
            }

            const response = await axios.get(`${API_URL}/discussion/student`, {
                params,
                headers: this.getAuthHeaders()
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching forums:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch forums');
        }
    }

    async getForumDetails(forumId) {
        try {
            const response = await axios.get(`${API_URL}/discussion/student/${forumId}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching forum details:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch forum details');
        }
    }

    async addComment(forumId, content) {
        try {
            const response = await axios.post(
                `${API_URL}/discussion/student/${forumId}/comments`,
                { content },
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw new Error(error.response?.data?.message || 'Failed to add comment');
        }
    }
}

export default new StudentForumService(); 