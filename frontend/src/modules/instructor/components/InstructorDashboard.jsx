import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import Tilt from 'react-parallax-tilt';
import { 
    FaVideo, 
    FaQuestionCircle, 
    FaBook, 
    FaComments, 
    FaChartLine,
    FaStar,
    FaGraduationCap,
    FaUserCircle,
    FaSignOutAlt,
    FaCog
} from 'react-icons/fa';
import { useAuth } from '../../../auth/context/AuthContext';

// Enhanced particle config
const particlesConfig = {
    fpsLimit: 120,
    particles: {
        number: {
            value: 80,
            density: { enable: true, value_area: 800 }
        },
        color: { value: "#ffffff" },
        opacity: {
            value: 0.1,
            random: true,
            animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true
        },
        move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "bounce" },
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
        },
        links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.1,
            width: 1
        },
    },
    detectRetina: true,
    interactivity: {
        detect_on: "canvas",
        events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true
        }
    }
};

const DashboardCard = ({ title, icon: Icon, description, link, stats, delay }) => {
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay }}
            className="h-full"
        >
            <Tilt
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                perspective={1000}
                scale={1.02}
                transitionSpeed={1000}
                gyroscope={true}
                className="h-full"
            >
                <Link 
                    to={link}
                    className="flex flex-col h-full bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/10 p-6 
                             hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden group shadow-lg
                             hover:shadow-xl hover:border-yellow-300/20"
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-orange-500/5 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content Section */}
                    <div className="flex-grow space-y-4 relative z-10">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/10 to-orange-500/10 
                                          group-hover:from-yellow-400/20 group-hover:to-orange-500/20 
                                          transition-all duration-500 shadow-inner">
                                <Icon className="text-xl text-yellow-300 transform group-hover:scale-110 
                                               transition-transform duration-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white/90 group-hover:text-yellow-300 
                                         transition-colors duration-500">
                                {title}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-white/50 text-sm line-clamp-2 group-hover:text-white/70 
                                    transition-colors duration-500">
                            {description}
                        </p>
                    </div>

                    {/* Stats Section */}
                    {stats && (
                        <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-white/40 text-sm group-hover:text-white/60 
                                               transition-colors duration-500">
                                    {stats.label}
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-white/90 group-hover:text-yellow-300 
                                                   transition-colors duration-500">
                                        <CountUp 
                                            end={stats.value} 
                                            duration={2} 
                                            decimals={stats.decimals || 0}
                                            separator=","
                                        />
                                    </span>
                                    {stats.unit && (
                                        <span className="text-sm text-white/50 group-hover:text-white/70 
                                                       transition-colors duration-500">
                                            {stats.unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hover Effect Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-4 
                                  group-hover:opacity-100 group-hover:translate-x-0 
                                  transition-all duration-500">
                        <svg 
                            className="w-6 h-6 text-yellow-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17 8l4 4m0 0l-4 4m4-4H3" 
                            />
                        </svg>
                    </div>
                </Link>
            </Tilt>
        </motion.div>
    );
};

const InstructorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
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

    const particlesInit = async (engine) => {
        await loadFull(engine);
    };

    const dashboardItems = [
        {
            title: "Video Management",
            icon: FaVideo,
            description: "Create, upload, and organize your educational video content with ease",
            link: "/instructor/videos",
            stats: { value: 24, label: "Total Videos" },
            delay: 0.1
        },
        {
            title: "Quiz Management",
            icon: FaQuestionCircle,
            description: "Design interactive quizzes and assessments to test student knowledge",
            link: "/instructor/quizzes",
            stats: { value: 12, label: "Active Quizzes" },
            delay: 0.2
        },
        {
            title: "Course Management",
            icon: FaBook,
            description: "Structure and manage your courses with comprehensive tools",
            link: "/instructor/courses",
            stats: { value: 8, label: "Published Courses" },
            delay: 0.3
        },
        {
            title: "Discussion Forums",
            icon: FaComments,
            description: "Foster student engagement through interactive discussion forums",
            link: "/instructor/forums",
            stats: { value: 156, label: "Active Discussions" },
            delay: 0.4
        },
        {
            title: "Analytics",
            icon: FaChartLine,
            description: "Track performance metrics and student engagement analytics",
            link: "/instructor/analytics",
            stats: { value: 2.5, unit: "K", label: "Total Views" },
            delay: 0.5
        },
        {
            title: "Course Ratings",
            icon: FaStar,
            description: "Monitor and respond to student feedback and course ratings",
            link: "/instructor/ratings",
            stats: { value: 4.8, label: "Average Rating", decimals: 1 },
            delay: 0.6
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 relative">
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={particlesConfig}
                className="absolute inset-0"
            />

            <div className="relative">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-xl"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Left side - Logo and Title */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                                        <FaGraduationCap className="text-2xl text-white" />
                                    </div>
                                    <div className="hidden md:block">
                                        <motion.h1 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-xl md:text-2xl font-bold text-white"
                                        >
                                            Welcome back, {user?.firstName}!
                                        </motion.h1>
                                        <motion.p 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-white/60 text-sm"
                                        >
                                            Instructor Dashboard
                                        </motion.p>
                                    </div>
                                </div>
                            </div>

                            {/* User Menu */}
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
                                                    <span>Instructor Profile</span>
                                                </button>

                                                {/* Settings Option */}
                                                <button className="w-full mt-1 px-4 py-2 text-left text-white hover:bg-indigo-800 rounded-lg 
                                                         transition-colors flex items-center gap-3 group">
                                                    <div className="p-2 rounded-lg bg-indigo-800 group-hover:bg-indigo-700 transition-colors">
                                                        <FaCog className="text-yellow-300" />
                                                    </div>
                                                    <span>Settings</span>
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
                </motion.div>

                <div className="relative z-10">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                            {dashboardItems.map((item, index) => (
                                <DashboardCard
                                    key={index}
                                    {...item}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard; 