import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Update response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.data);
        return response;
    },
    async (error) => {
        console.error('Response error:', error);

        if (!error.response) {
            // Network error
            console.error('Network error details:', error);
            throw new Error('Network error - please check your connection and try again');
        }

        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                throw refreshError;
            }
        }

        // Extract error message from response if available
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
    }
);

const authService = {
    async register(userData) {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async logout(refreshToken) {
        try {
            const response = await axiosInstance.post('/auth/logout', { refreshToken });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async forgotPassword(email) {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async resetPassword(token, password) {
        try {
            const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async verifyEmail(token) {
        try {
            const response = await axiosInstance.get(`/auth/verify-email/${token}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getProfile() {
        try {
            const response = await axiosInstance.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateProfile(userData) {
        try {
            const response = await axiosInstance.patch('/auth/profile', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    setAuthHeader(token) {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }
};

export default authService; 