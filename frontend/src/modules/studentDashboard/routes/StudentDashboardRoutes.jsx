import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from '../context/DashboardContext';
import Dashboard from '../components/Dashboard';
import CourseDetail from '../components/CourseDetail';
import VideoDetail from '../components/VideoDetail';

const StudentDashboardRoutes = () => {
    return (
        <DashboardProvider>
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="courses/:courseId" element={<CourseDetail />} />
                <Route path="videos/:videoId" element={<VideoDetail />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </DashboardProvider>
    );
};

export default StudentDashboardRoutes; 