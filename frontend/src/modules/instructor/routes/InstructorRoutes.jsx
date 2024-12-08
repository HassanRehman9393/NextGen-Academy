import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnalyticsProvider } from '../../analytics/context/AnalyticsContext';
import InstructorDashboard from '../components/InstructorDashboard';
import VideoDashboard from '../../videoManagement/components/VideoDashboard';
import { VideoProvider } from '../../videoManagement/context/VideoContext';
import QuizRoutes from '../../quizManagement/routes/QuizRoutes';
import CourseRoutes from '../../courseManagement/routes';
import DiscussionRoutes from '../../discussion/routes/DiscussionRoutes';
import AnalyticsRoutes from '../../analytics/routes/AnalyticsRoutes';
import RatingManagementRoutes from '../../ratings/routes/RatingManagementRoutes';

const InstructorRoutes = () => {
    return (
        <AnalyticsProvider>
            <Routes>
                <Route index element={<InstructorDashboard />} />
                <Route 
                    path="videos/*" 
                    element={
                        <VideoProvider>
                            <VideoDashboard />
                        </VideoProvider>
                    } 
                />
                <Route path="quizzes/*" element={<QuizRoutes />} />
                <Route path="courses/*" element={<CourseRoutes />} />
                <Route path="forums/*" element={<DiscussionRoutes />} />
                <Route path="analytics/*" element={<AnalyticsRoutes />} />
                <Route path="ratings/*" element={<RatingManagementRoutes />} />
            </Routes>
        </AnalyticsProvider>
    );
};

export default InstructorRoutes; 