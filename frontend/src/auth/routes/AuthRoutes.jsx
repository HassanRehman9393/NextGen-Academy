import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import VerifyEmail from '../components/VerifyEmail';
import { useAuth } from '../hooks/useAuth';

const AuthRoutes = () => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // If authenticated, determine and redirect to dashboard
    if (isAuthenticated) {
        const dashboardPath = user?.roles?.includes('instructor') 
            ? '/instructor/dashboard' 
            : '/student/dashboard';
        return <Navigate to={dashboardPath} replace />;
    }

    // Show auth routes for non-authenticated users
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            {/* Redirect undefined auth routes to login */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    );
};

export default AuthRoutes; 
 