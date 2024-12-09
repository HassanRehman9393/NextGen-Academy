import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading stored user:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (userData) => {
        try {
            console.log('Login data received:', userData);

            // Handle social login data structure
            if (userData.user && userData.token) {
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData.user));
                setUser(userData.user);
                
                const redirectPath = userData.user.roles?.includes('instructor') 
                    ? '/instructor'
                    : '/dashboard';
                navigate(redirectPath, { replace: true });
                return;
            }

            // Handle normal login data structure
            if (!userData?.success || !userData?.data) {
                throw new Error('Invalid response format');
            }

            const { token, refreshToken, user } = userData.data;

            if (!token || !refreshToken || !user) {
                throw new Error('Missing required login data');
            }

            // Store tokens and user data
            localStorage.setItem('token', `Bearer ${token}`);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);

            // Navigate based on role
            if (user.roles?.includes('instructor')) {
                navigate('/instructor');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.clear();
            setUser(null);
            navigate('/login');
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 