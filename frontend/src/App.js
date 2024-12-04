import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/context/AuthContext';
import InstructorRoute from './auth/components/InstructorRoute';
import StudentRoute from './auth/components/StudentRoute';
import PrivateRoute from './auth/components/PrivateRoute';
import { useAuth } from './auth/hooks/useAuth';

// Public Components
import Welcome from './components/Welcome';
import Login from './auth/components/Login';
import Register from './auth/components/Register';
import ForgotPassword from './auth/components/ForgotPassword';
import ResetPassword from './auth/components/ResetPassword';
import VerifyEmail from './auth/components/VerifyEmail';

// Instructor Components
import InstructorDashboard from './modules/instructor/components/InstructorDashboard';
import VideoDashboard from './modules/videoManagement/components/VideoDashboard';
import { VideoProvider } from './modules/videoManagement/context/VideoContext';
import QuizRoutes from './modules/quizManagement/routes/QuizRoutes';
import CourseRoutes from './modules/courseManagement/routes';
import DiscussionRoutes from './modules/discussion/routes/DiscussionRoutes';

// Student Components
import StudentDashboardRoutes from './modules/studentDashboard/routes/StudentDashboardRoutes';
import { StudentForumProvider } from './modules/discussion/context/StudentForumContext';
import ForumCatalog from './modules/discussion/components/ForumCatalog';
import ForumDetailsStudent from './modules/discussion/components/ForumDetailsStudent';

// Redirect based on user role
const RoleBasedRedirect = () => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (user.roles.includes('instructor')) {
        return <Navigate to="/instructor" replace />;
    }
    
    return <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <AuthProvider>
            <StudentForumProvider>
                <div className="App">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Welcome />} />
                        <Route path="/" element={<RoleBasedRedirect />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/verify-email/:token" element={<VerifyEmail />} />

                        {/* Protected Instructor routes */}
                        <Route path="/instructor" element={<InstructorRoute />}>
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
                        </Route>

                        {/* Protected Student routes */}
                        <Route path="/dashboard/*" element={<StudentRoute />}>
                            <Route path="*" element={<StudentDashboardRoutes />} />
                            <Route path="forums" element={<ForumCatalog />} />
                            <Route path="forums/:forumId" element={<ForumDetailsStudent />} />
                        </Route>

                        {/* Catch-all redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </StudentForumProvider>
        </AuthProvider>
    );
}

export default App;