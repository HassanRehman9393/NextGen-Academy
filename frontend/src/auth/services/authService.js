import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            console.log('Auth service response:', response.data);

            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Login failed');
            }

            if (!response.data.data?.token || !response.data.data?.user) {
                throw new Error('Invalid response from server');
            }

            return response.data;
        } catch (error) {
            console.error('Auth service error:', error);
            throw new Error(error.response?.data?.message || 'Failed to login');
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Registration failed');
            }

            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Failed to register');
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to process request');
        }
    },

    resetPassword: async (token, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to reset password');
        }
    },

    verifyEmail: async (token) => {
        try {
            const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to verify email');
        }
    }
};

export default authService; 