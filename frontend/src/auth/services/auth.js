import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

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