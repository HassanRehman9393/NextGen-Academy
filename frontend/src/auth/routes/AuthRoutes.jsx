import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import VerifyEmail from '../components/VerifyEmail';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from '../components';
import GitHubCallback from '../components/GitHubCallback';

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="verify-email/:token" element={<VerifyEmail />} />
            <Route path="auth/success" element={<Navigate to="/dashboard" />} />
            <Route 
                path="auth/error" 
                element={<Navigate to="/login" state={{ error: 'Social authentication failed' }} />} 
            />
            <Route 
                path="dashboard" 
                element={
                    <ProtectedRoute>
                        <div>Dashboard (Protected Route)</div>
                    </ProtectedRoute>
                } 
            />
            <Route path="auth/github/callback" element={<GitHubCallback />} />
        </Routes>
    );
};

export default AuthRoutes; 