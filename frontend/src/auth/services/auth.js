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
            redirectPath: user.roles.includes('instructor') ? '/instructor/dashboard' : '/dashboard'
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
    if (!token) {
        console.error('No token provided to handleSocialCallback');
        return null;
    }
    
    try {
        console.log('Handling social callback with token:', token);
        
        // Store the token with Bearer prefix if not present
        const tokenWithBearer = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        localStorage.setItem('token', tokenWithBearer);
        
        // Fetch user profile
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: tokenWithBearer }
        });
        
        console.log('Profile response:', response.data);
        
        if (!response.data || (!response.data.user && !response.data.data)) {
            throw new Error('Invalid profile response');
        }

        const user = response.data.user || response.data.data;
        
        // Ensure user has roles
        if (!user.roles) {
            user.roles = ['student'];
        }

        // Store user data
        localStorage.setItem('user', JSON.stringify(user));

        return {
            user,
            token: tokenWithBearer,
            redirectPath: user.roles?.includes('instructor') ? '/instructor' : '/dashboard'
        };
    } catch (error) {
        console.error('Social callback error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
    }
};

export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}; 