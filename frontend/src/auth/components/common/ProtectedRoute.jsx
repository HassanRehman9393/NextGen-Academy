import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Check for token in URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [location]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size={8} color="text-indigo-600" />
            </div>
        );
    }

    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (!user && !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRoles.length > 0 && user && !requiredRoles.some(role => user.roles.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute; 