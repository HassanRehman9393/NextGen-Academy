import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
            user,
            redirectPath: user.roles.includes('instructor') ? '/instructor/dashboard' : '/student/dashboard'
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const githubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
};

export const googleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
};

export const resetPassword = async (token, newPassword) => {
    try {
        console.log('Sending reset password request');
        
        const response = await axios.post(
            `${API_URL}/auth/reset-password/${token}`,
            { newPassword },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Reset password error:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Password reset failed');
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/forgot-password`,
            { email }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const handleSocialCallback = async (token) => {
    if (!token) return null;
    
    try {
        // Store the token
        localStorage.setItem('token', token);
        
        // Fetch user profile
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
            user,
            redirectPath: user.roles.includes('instructor') ? '/instructor/dashboard' : '/student/dashboard'
        };
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
}; 