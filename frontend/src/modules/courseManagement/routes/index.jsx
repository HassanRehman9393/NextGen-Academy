import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CourseDashboard from '../components/CourseDashboard';
import CourseDetailView from '../components/CourseDetailView';
import { CourseProvider } from '../context/CourseContext';

const CourseRoutes = () => {
    return (
        <CourseProvider>
            <Routes>
                <Route path="/" element={<CourseDashboard />} />
                <Route path="/:courseId" element={<CourseDetailView />} />
            </Routes>
        </CourseProvider>
    );
};

export default CourseRoutes; 