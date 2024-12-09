import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaVideo, FaBook, FaChalkboardTeacher, 
         FaComments, FaQuestionCircle, FaTachometerAlt, FaUserCircle, 
         FaBars, FaTimes, FaRobot, FaSignOutAlt } from 'react-icons/fa';  // Added FaRobot
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
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/');
        }
    };

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
                    {/* Added Chatbot Link */}
                    <SidebarLink 
                        to="/dashboard/chatbot" 
                        icon={FaRobot} 
                        text="NextGen AI"
                        isActive={location.pathname.includes('/chatbot')}
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
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="relative">
                                            <FaUserCircle className="text-2xl text-yellow-300" />
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-indigo-900"></div>
                                        </div>
                                        <span className="text-white/80 hidden md:inline">{user?.firstName}</span>
                                    </button>

                                    {showUserMenu && (
                                        <>
                                            {/* Backdrop */}
                                            <div 
                                                className="fixed inset-0 z-[100]" 
                                                onClick={() => setShowUserMenu(false)}
                                            />
                                            
                                            {/* Dropdown Menu */}
                                            <div 
                                                className="absolute right-0 mt-2 w-72 bg-indigo-900 rounded-xl border border-indigo-700/50 
                                                         shadow-2xl overflow-hidden z-[101] transform-gpu transition-all duration-200 
                                                         origin-top-right animate-fadeIn"
                                            >
                                                {/* User Info Section */}
                                                <div className="p-4 bg-indigo-800 border-b border-indigo-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-full bg-indigo-700">
                                                            <FaUserCircle className="text-3xl text-yellow-300" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                                                            <p className="text-white/70 text-sm truncate">{user?.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Menu Items */}
                                                <div className="p-2 bg-indigo-900">
                                                    {/* Profile Section */}
                                                    <button className="w-full px-4 py-2 text-left text-white hover:bg-indigo-800 rounded-lg 
                                                                     transition-colors flex items-center gap-3 group">
                                                        <div className="p-2 rounded-lg bg-indigo-800 group-hover:bg-indigo-700 transition-colors">
                                                            <FaGraduationCap className="text-yellow-300" />
                                                        </div>
                                                        <span>Student Profile</span>
                                                    </button>

                                                    {/* Logout Button */}
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full mt-1 px-4 py-2 text-left text-red-400 hover:bg-red-950 rounded-lg 
                                                                         transition-colors flex items-center gap-3 group"
                                                    >
                                                        <div className="p-2 rounded-lg bg-red-950/50 group-hover:bg-red-900 transition-colors">
                                                            <FaSignOutAlt className="text-red-400" />
                                                        </div>
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
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