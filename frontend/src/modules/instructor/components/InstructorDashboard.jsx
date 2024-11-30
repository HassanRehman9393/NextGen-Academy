import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaVideo, 
    FaQuestionCircle, 
    FaBook, 
    FaComments, 
    FaChalkboardTeacher,
    FaGraduationCap 
} from 'react-icons/fa';
import { useAuth } from '../../../auth/context/AuthContext';

const DashboardCard = ({ title, icon: Icon, description, link, color }) => (
    <Link 
        to={link}
        className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:scale-105 transition-all duration-300 group ${color}`}
    >
        <div className="flex items-center mb-4">
            <Icon className="text-3xl mr-3 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-white/60 mb-4">{description}</p>
        <div className="text-sm text-yellow-300/80 group-hover:text-yellow-300 transition-colors">
            Access {title} →
        </div>
    </Link>
);

const InstructorDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <FaGraduationCap className="text-yellow-300 text-4xl" />
                            <div>
                                <h1 className="text-2xl font-bold text-white">Welcome, {user?.firstName || 'Instructor'}!</h1>
                                <p className="text-white/60">Manage your educational content and engage with students</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard
                        title="Video Management"
                        icon={FaVideo}
                        description="Create and manage your educational videos. Upload new content and organize your video library."
                        link="/instructor/videos"
                        color="hover:border-blue-400/30"
                    />

                    <DashboardCard
                        title="Quiz Management"
                        icon={FaQuestionCircle}
                        description="Create interactive quizzes to test student knowledge and track their progress."
                        link="/instructor/quizzes"
                        color="hover:border-green-400/30"
                    />

                    <DashboardCard
                        title="Course Management"
                        icon={FaBook}
                        description="Organize your content into structured courses. Create and edit course materials."
                        link="/instructor/courses"
                        color="hover:border-purple-400/30"
                    />

                    <DashboardCard
                        title="Discussion Forums"
                        icon={FaComments}
                        description="Engage with students in course discussions. Answer questions and foster community."
                        link="/instructor/forums"
                        color="hover:border-pink-400/30"
                    />

                    <DashboardCard
                        title="Student Feedback"
                        icon={FaChalkboardTeacher}
                        description="View and respond to student feedback. Track course ratings and reviews."
                        link="/instructor/feedback"
                        color="hover:border-orange-400/30"
                    />
                </div>

                {/* Quick Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h4 className="text-white/60 mb-2">Total Videos</h4>
                        <div className="text-3xl font-bold text-white">24</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h4 className="text-white/60 mb-2">Active Quizzes</h4>
                        <div className="text-3xl font-bold text-white">12</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h4 className="text-white/60 mb-2">Student Interactions</h4>
                        <div className="text-3xl font-bold text-white">156</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard; 