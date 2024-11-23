import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './common/LoadingSpinner';
import authService from '../services/authService';

const GitHubCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const accessToken = params.get('accessToken');
                const refreshToken = params.get('refreshToken');
                
                if (accessToken && refreshToken) {
                    // Store tokens
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    // Get user profile
                    const response = await authService.getProfile();
                    setUser(response.user);
                    
                    // Redirect to dashboard
                    navigate('/dashboard');
                } else {
                    throw new Error('No tokens received');
                }
            } catch (error) {
                console.error('GitHub callback error:', error);
                navigate('/login', {
                    state: { error: 'Failed to complete GitHub authentication' }
                });
            }
        };

        handleCallback();
    }, [navigate, location, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size={8} color="text-indigo-600" />
            <p className="ml-2">Completing GitHub authentication...</p>
        </div>
    );
};

export default GitHubCallback; 