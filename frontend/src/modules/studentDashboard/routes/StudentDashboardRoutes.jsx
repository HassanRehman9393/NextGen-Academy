import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from '../context/DashboardContext';
import Dashboard from '../components/Dashboard';
import CourseDetail from '../components/CourseDetail';
import VideoDetail from '../components/VideoDetail';

const StudentDashboardRoutes = () => {
    return (
        <DashboardProvider>
                <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="courses/:courseId" element={<CourseDetail />} />
                        <Route path="videos/:videoId" element={<VideoDetail />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
        </DashboardProvider>
    );
};

export default StudentDashboardRoutes; 