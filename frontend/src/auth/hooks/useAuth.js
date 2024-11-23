import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../utils/authContext';
import authService from '../services/authService';

export const useAuth = () => {
    const navigate = useNavigate();
    const auth = useAuthContext();

    const handleLogin = useCallback(async (credentials) => {
        try {
            const user = await auth.login(credentials);
            navigate('/dashboard');
            return user;
        } catch (error) {
            throw error;
        }
    }, [auth, navigate]);

    const handleLogout = useCallback(async () => {
        await auth.logout();
        navigate('/login');
    }, [auth, navigate]);

    const handleRegister = useCallback(async (userData) => {
        try {
            const response = await authService.register(userData);
            navigate('/login', { 
                state: { 
                    message: 'Registration successful! Please check your email to verify your account.' 
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }, [navigate]);

    const handleForgotPassword = useCallback(async (email) => {
        try {
            const response = await authService.forgotPassword(email);
            navigate('/login', { 
                state: { 
                    message: 'Password reset instructions have been sent to your email.' 
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }, [navigate]);

    return {
        ...auth,
        handleLogin,
        handleLogout,
        handleRegister,
        handleForgotPassword
    };
}; 