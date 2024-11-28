import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './auth/components/PrivateRoute';
import InstructorRoute from './auth/components/InstructorRoute';

// Public Components
import Welcome from './components/Welcome';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import ForgotPassword from './auth/components/ForgotPassword';
import ResetPassword from './auth/components/ResetPassword';
import VerifyEmail from './auth/components/VerifyEmail';

// Video Management Components
import VideoDashboard from './modules/videoManagement/components/VideoDashboard';
import { VideoProvider } from './modules/videoManagement/context/VideoContext';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />

                    {/* Protected Instructor routes */}
                    <Route
                        path="/instructor/*"
                        element={
                            <InstructorRoute>
                                <VideoProvider>
                                    <Routes>
                                        <Route path="videos" element={<VideoDashboard />} />
                                        <Route path="" element={<Navigate to="videos" replace />} />
                                    </Routes>
                                </VideoProvider>
                            </InstructorRoute>
                        }
                    />

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
