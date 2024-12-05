import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaVideo, FaBook, FaChalkboardTeacher, 
         FaComments, FaQuestionCircle, FaTachometerAlt, FaUserCircle, 
         FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../auth/context/AuthContext';

const SidebarLink = ({ to, icon: Icon, text, isActive, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive 
                ? 'bg-yellow-400/20 text-yellow-300' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`}
    >
        <Icon className={`text-xl ${isActive ? 'text-yellow-300' : 'text-white/70'}`} />
        <span className="font-medium">{text}</span>
    </Link>
);

const StudentLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div 
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10
                    transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Close button for mobile */}
                <button
                    onClick={closeSidebar}
                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white lg:hidden"
                >
                    <FaTimes className="text-xl" />
                </button>

                {/* Logo Section */}
                <div className="flex items-center space-x-3 px-4 py-5 mb-8">
                    <FaGraduationCap className="text-3xl text-yellow-400" />
                    <span className="text-xl font-bold text-white">NextGen Academy</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2 px-4">
                    <SidebarLink 
                        to="/dashboard" 
                        icon={FaTachometerAlt} 
                        text="Dashboard"
                        isActive={location.pathname === '/dashboard'}
                        onClick={closeSidebar}
                    />
                    <SidebarLink 
                        to="/dashboard/courses" 
                        icon={FaBook} 
                        text="My Courses"
                        isActive={location.pathname.includes('/courses')}
                        onClick={closeSidebar}
                    />
                    <SidebarLink 
                        to="/dashboard/videos" 
                        icon={FaVideo} 
                        text="Videos"
                        isActive={location.pathname.includes('/videos')}
                        onClick={closeSidebar}
                    />
                    <SidebarLink 
                        to="/dashboard/quizzes" 
                        icon={FaQuestionCircle} 
                        text="Quizzes"
                        isActive={location.pathname.includes('/quizzes')}
                        onClick={closeSidebar}
                    />
                    <SidebarLink 
                        to="/dashboard/forums" 
                        icon={FaComments} 
                        text="Forums"
                        isActive={location.pathname.includes('/forums')}
                        onClick={closeSidebar}
                    />
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {/* Hamburger Menu Button */}
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 rounded-lg bg-white/5 text-white hover:bg-white/10 lg:hidden"
                                >
                                    <FaBars className="text-xl" />
                                </button>
                                <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                                    Student Dashboard
                                </h1>
                            </div>
                            
                            {/* User Profile Section */}
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-white font-medium truncate">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-white/60 text-sm truncate">{user?.email}</p>
                                </div>
                                <div className="relative">
                                    <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
                                        <FaUserCircle className="text-2xl md:text-3xl text-yellow-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default StudentLayout; 