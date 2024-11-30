import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const InstructorRoute = () => {
    const { user, loading } = useAuth();
    
    console.log('InstructorRoute - User:', user);
    console.log('InstructorRoute - Loading:', loading);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        console.log('No user found, redirecting to login');
        return <Navigate to="/login" />;
    }

    if (!user.roles?.includes('instructor')) {
        console.log('User is not an instructor, redirecting to home');
        return <Navigate to="/" />;
    }

    console.log('Rendering instructor dashboard');
    return <Outlet />;
};

export default InstructorRoute; 