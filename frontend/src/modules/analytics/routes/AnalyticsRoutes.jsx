import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnalyticsProvider } from '../context/AnalyticsContext';
import Analytics from '../components/Analytics';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AnalyticsRoutes = () => {
    return (
        <AnalyticsProvider>
            <Routes>
                <Route index element={<AnalyticsDashboard />} />
                <Route path=":courseId" element={<Analytics />} />
            </Routes>
        </AnalyticsProvider>
    );
};

export default AnalyticsRoutes; 