import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/context/AuthContext';
import InstructorRoute from './auth/components/InstructorRoute';
import StudentRoute from './auth/components/StudentRoute';
import { useAuth } from './auth/hooks/useAuth';

// Public Components
import Welcome from './components/Welcome';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import ForgotPassword from './auth/components/ForgotPassword';
import ResetPassword from './auth/components/ResetPassword';
import VerifyEmail from './auth/components/VerifyEmail';

// Instructor Components
import InstructorRoutes from './modules/instructor/routes/InstructorRoutes';
import InstructorDashboard from './modules/instructor/components/InstructorDashboard';
import VideoDashboard from './modules/videoManagement/components/VideoDashboard';
import { VideoProvider } from './modules/videoManagement/context/VideoContext';
import QuizRoutes from './modules/quizManagement/routes/QuizRoutes';
import CourseRoutes from './modules/courseManagement/routes';
import DiscussionRoutes from './modules/discussion/routes/DiscussionRoutes';
import Analytics from './modules/analytics/components/Analytics';
import AnalyticsDashboard from './modules/analytics/components/AnalyticsDashboard';

// Student Components
import Dashboard from './modules/studentDashboard/components/Dashboard';
import StudentDashboardRoutes from './modules/studentDashboard/routes/StudentDashboardRoutes';
import { DashboardProvider } from './modules/studentDashboard/context/DashboardContext';
import StudentForumRoutes from './modules/discussion/routes/StudentForumRoutes';
import CourseDetail from './modules/studentDashboard/components/CourseDetail';
import VideoDetail from './modules/studentDashboard/components/VideoDetail';
import QuizDetail from './modules/studentDashboard/components/QuizDetail';

// Chatbot Components
import ChatbotRoutes from './modules/chatbot/routes/ChatbotRoutes';

// Analytics Components
import { AnalyticsProvider } from './modules/analytics/context/AnalyticsContext';

function App() {
    return (
        <AuthProvider>
            <DashboardProvider>
                <AnalyticsProvider>
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
                            <Route path="/instructor/*" element={<InstructorRoute />}>
                                <Route path="*" element={<InstructorRoutes />} />
                            </Route>

                            {/* Protected Student routes */}
                            <Route path="/dashboard/*" element={<StudentRoute />}>
                                <Route index element={<Dashboard />} />
                                <Route element={<StudentDashboardRoutes />}>
                                    <Route path="courses/:courseId" element={<CourseDetail />} />
                                    <Route path="videos/:videoId" element={<VideoDetail />} />
                                    <Route path="quizzes/:quizId" element={<QuizDetail />} />
                                </Route>
                                <Route path="forums/*" element={<StudentForumRoutes />} />
                                <Route path="chatbot/*" element={<ChatbotRoutes />} />
                            </Route>

                            {/* Catch-all redirect */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </AnalyticsProvider>
            </DashboardProvider>
        </AuthProvider>
    );
}

export default App;