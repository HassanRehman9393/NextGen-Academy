import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuizDashboard from '../components/QuizDashboard';
import QuizProvider from '../context/QuizContext';

const QuizRoutes = () => {
    return (
        <QuizProvider>
            <Routes>
                <Route index element={<QuizDashboard />} />
            </Routes>
        </QuizProvider>
    );
};

export default QuizRoutes; 