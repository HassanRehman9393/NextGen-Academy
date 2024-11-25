import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { handleAuthCallback } from '../services/auth';

export const AuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const username = searchParams.get('user');
        
        if (token && username) {
            handleAuthCallback(token, username);
        }
    }, [searchParams]);

    return <div>Processing login...</div>;
}; 