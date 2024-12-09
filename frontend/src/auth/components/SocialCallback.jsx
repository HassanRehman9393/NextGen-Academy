import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleSocialCallback } from '../services/auth';

const SocialCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (!token) {
                    console.error('No token found in URL');
                    throw new Error('No token provided');
                }

                console.log('Token found, handling social callback');
                const result = await handleSocialCallback(token);
                console.log('Social callback result:', result);

                // Login will handle navigation
                await login(result);
            } catch (error) {
                console.error('Social callback error:', error);
                navigate('/auth/login', { replace: true });
            }
        };

        handleCallback();
    }, [navigate, location, login]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center">
            <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-yellow-300 mx-auto mb-4"></div>
                <p>Completing login...</p>
            </div>
        </div>
    );
};

export default SocialCallback; 