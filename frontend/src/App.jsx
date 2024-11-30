import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './auth/components/Login';
import InstructorRoute from './auth/components/InstructorRoute';
import InstructorDashboard from './modules/instructor/components/InstructorDashboard';
import VideoDashboard from './modules/videoManagement/components/VideoDashboard';
import QuizRoutes from './modules/quizManagement/routes/QuizRoutes';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/instructor" element={<InstructorRoute />}>
                <Route index element={<InstructorDashboard />} />
                <Route path="videos/*" element={<VideoDashboard />} />
                <Route path="quizzes/*" element={<QuizRoutes />} />
            </Route>
        </Routes>
    );
}

export default App; 