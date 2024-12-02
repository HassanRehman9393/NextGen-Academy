import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class DashboardService {
    constructor() {
        this.baseURL = `${API_URL}/dashboard`;
        this.initializeAxios();
    }

    initializeAxios() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async getCourses(params = {}) {
        try {
            console.log('Sending request with params:', params);
            const response = await this.axiosInstance.get('/dashboard/courses', { params });
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in getCourses:', error);
            throw error;
        }
    }

    async getVideos(params = {}) {
        try {
            console.log('Sending request with params:', params);
            const response = await this.axiosInstance.get('/dashboard/videos', { params });
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in getVideos:', error);
            throw error;
        }
    }

    async getCourseById(courseId) {
        try {
            const response = await this.axiosInstance.get(`/dashboard/courses/${courseId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getCourseById:', error);
            throw error;
        }
    }

    async getVideoById(videoId) {
        try {
            const response = await this.axiosInstance.get(`/dashboard/videos/${videoId}`);
            return response.data;
        } catch (error) {
            console.error('Error in getVideoById:', error);
            throw error;
        }
    }
}

export default new DashboardService(); 