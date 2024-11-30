import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaVideo, FaQuestionCircle, FaChartLine, FaUsers, FaClock,
    FaGraduationCap, FaChalkboardTeacher, FaBell, FaDownload,
    FaRegCalendarAlt, FaChartBar, FaEllipsisH, FaRegClock
} from 'react-icons/fa';
import { useAuth } from '../../../auth/context/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalVideos: 0,
        totalQuizzes: 0,
        totalStudents: 0,
        totalEarnings: 0,
        recentActivities: [],
        upcomingClasses: [],
        performanceMetrics: {},
        studentProgress: []
    });

    // Chart data
    const studentProgressData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Student Progress',
            data: [65, 75, 70, 80, 85, 90],
            fill: true,
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            borderColor: 'rgba(147, 51, 234, 0.8)',
            tension: 0.4
        }]
    };

    const completionRateData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
            data: [65, 25, 10],
            backgroundColor: [
                'rgba(147, 51, 234, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(209, 213, 219, 0.8)'
            ]
        }]
    };

    useEffect(() => {
        setStats({
            totalVideos: 12,
            totalQuizzes: 8,
            totalStudents: 156,
            totalEarnings: 12450,
            recentActivities: [
                { type: 'video', action: 'New video "React Hooks Advanced" uploaded', time: '2 hours ago' },
                { type: 'quiz', action: 'Quiz "JavaScript Basics" completed by 5 students', time: '5 hours ago' },
                { type: 'student', action: 'New student John Doe enrolled', time: '1 day ago' }
            ],
            upcomingClasses: [
                { title: 'Advanced React Patterns', time: '2:00 PM Today', students: 25 },
                { title: 'JavaScript ES6+', time: '4:30 PM Today', students: 18 }
            ],
            performanceMetrics: {
                studentEngagement: 78,
                courseCompletion: 85,
                averageRating: 4.8
            }
        });
    }, []);

    const DashboardCard = ({ icon: Icon, title, value, subtitle, trend }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/[0.15] transition-all duration-300"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/70 text-sm">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">
                        <CountUp end={value} duration={2} separator="," />
                    </h3>
                    {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
                    {trend && (
                        <p className={`text-xs mt-2 ${trend.type === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.type === 'up' ? '↑' : '↓'} {trend.value}
                        </p>
                    )}
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                    <Icon className="text-2xl text-white" />
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 p-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-lg">
                            <FaChalkboardTeacher className="text-3xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Welcome back, {user?.firstName}!
                            </h1>
                            <p className="text-white/70 mt-1">
                                Here's what's happening with your courses today
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            data-tooltip-id="download-tooltip"
                            data-tooltip-content="Download Reports"
                        >
                            <FaDownload className="text-white/80" />
                        </motion.button>
                        <Tooltip id="download-tooltip" />
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard
                    icon={FaVideo}
                    title="Total Videos"
                    value={stats.totalVideos}
                    subtitle="12 new this month"
                    trend={{ type: 'up', value: '12%' }}
                />
                {/* ... other cards ... */}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Student Progress</h2>
                    <Line data={studentProgressData} options={{
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: { mode: 'index', intersect: false }
                        },
                        scales: {
                            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } }
                        }
                    }} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Course Completion Rate</h2>
                    <div className="w-2/3 mx-auto">
                        <Doughnut data={completionRateData} options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'bottom', labels: { color: 'white' } }
                            }
                        }} />
                    </div>
                </motion.div>
            </div>

            {/* Activity Feed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
            >
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FaClock className="text-yellow-300" />
                    Recent Activity
                </h2>
                <div className="space-y-4">
                    {stats.recentActivities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <div className="bg-white/10 p-2 rounded-lg">
                                <FaGraduationCap className="text-white/80" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white">{activity.action}</p>
                                <span className="text-white/40 text-xs">{activity.time}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default InstructorDashboard; 