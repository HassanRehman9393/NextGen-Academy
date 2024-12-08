import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RatingManagementProvider } from '../context/RatingManagementContext';
import RatingManagement from '../components/RatingManagement';
import RatingList from '../components/RatingList';
import ErrorBoundary from '../components/ErrorBoundary';

const RatingManagementRoutes = () => {
    return (
        <RatingManagementProvider>
            <ErrorBoundary>
                <Routes>
                    <Route index element={<RatingManagement />} />
                    <Route path=":courseId" element={<RatingList />} />
                </Routes>
            </ErrorBoundary>
        </RatingManagementProvider>
    );
};

export default RatingManagementRoutes; 