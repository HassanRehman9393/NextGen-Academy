import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnalyticsProvider } from '../analytics/context/AnalyticsContext';
import InstructorDashboard from '../components/InstructorDashboard';
import VideoDashboard from '../../videoManagement/components/VideoDashboard';
import { VideoProvider } from '../../videoManagement/context/VideoContext';
import QuizRoutes from '../../quizManagement/routes/QuizRoutes';
import CourseRoutes from '../../courseManagement/routes';
import DiscussionRoutes from '../../discussion/routes/DiscussionRoutes';
import Analytics from '../../analytics/components/Analytics';
import AnalyticsDashboard from '../../analytics/components/AnalyticsDashboard';
import AnalyticsRoutes from '../../analytics/routes/AnalyticsRoutes';

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
            </Routes>
        </AnalyticsProvider>
    );
};

export default InstructorRoutes; 