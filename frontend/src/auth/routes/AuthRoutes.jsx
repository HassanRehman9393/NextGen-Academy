import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import VerifyEmail from '../components/VerifyEmail';
import SocialCallback from '../components/SocialCallback';
import { useAuth } from '../hooks/useAuth';

const AuthRoutes = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const currentPath = window.location.pathname;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-yellow-300 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Only redirect if authenticated and not on social-callback route
    if (isAuthenticated && !currentPath.includes('social-callback')) {
        const dashboardPath = user?.roles?.includes('instructor') 
            ? '/instructor/dashboard' 
            : '/dashboard';
        return <Navigate to={dashboardPath} replace />;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/social-callback" element={<SocialCallback />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    );
};

export default AuthRoutes; 
 