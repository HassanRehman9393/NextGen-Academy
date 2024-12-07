import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class RatingService {
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token provided');
        }

        // Clean up token format
        const cleanToken = token.replace('Bearer ', '').trim();
        const tokenValue = `Bearer ${cleanToken}`;

        console.log('Using token:', tokenValue);

        return {
            'Authorization': tokenValue,
            'Content-Type': 'application/json'
        };
    }

    async addRating(courseId, ratingData) {
        try {
            console.log('Adding rating:', { courseId, ratingData });
            console.log('Headers:', this.getAuthHeaders());
            
            const response = await axios.post(
                `${API_URL}/ratings/course/${courseId}`,
                ratingData,
                { headers: this.getAuthHeaders() }
            );
            
            console.log('Add rating response:', response);
            return response.data;
        } catch (error) {
            console.error('Error adding rating:', error.response || error);
            throw new Error(error.response?.data?.message || 'Failed to add rating');
        }
    }

    async getCourseRatings(courseId, page = 1, limit = 10) {
        try {
            console.log('Fetching ratings with headers:', this.getAuthHeaders());
            const response = await axios.get(
                `${API_URL}/ratings/course/${courseId}`,
                {
                    params: { page, limit },
                    headers: this.getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching ratings:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch ratings');
        }
    }

    async getStudentRating(courseId) {
        try {
            const response = await axios.get(
                `${API_URL}/ratings/course/${courseId}/student`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch student rating');
        }
    }

    async updateRating(ratingId, ratingData) {
        try {
            const response = await axios.put(
                `${API_URL}/ratings/${ratingId}`,
                ratingData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update rating');
        }
    }

    async deleteRating(ratingId) {
        try {
            const response = await axios.delete(
                `${API_URL}/ratings/${ratingId}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete rating');
        }
    }
}

export default new RatingService(); 