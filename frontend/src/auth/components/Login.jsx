import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import AuthBackground from './AuthBackground';
import { motion } from 'framer-motion';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [verificationMessage, setVerificationMessage] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setVerificationMessage('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            
            // Check if email verification is required
            if (response.requiresVerification) {
                setVerificationMessage('Please verify your email before logging in. Check your inbox for the verification link.');
                setLoading(false);
                return;
            }

            await login(response);
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.data?.requiresVerification) {
                setVerificationMessage('Please verify your email before logging in. Check your inbox for the verification link.');
            } else {
                setError(err.message || 'Failed to login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 relative overflow-hidden">
            <AuthBackground />
            
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo Section */}
                    <div className="flex items-center justify-center mb-8">
                        <FaGraduationCap className="text-yellow-300 text-4xl mr-2 animate-bounce" />
                        <h1 className="text-white text-3xl font-bold">NextGen Academy</h1>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

                        {verificationMessage && (
                            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm text-center">
                                {verificationMessage}
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                                    placeholder-white/50 focus:bg-white/10 hover:bg-white/10 
                                    focus:border-yellow-300 focus:ring-0 transition-all duration-300"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                                    placeholder-white/50 focus:bg-white/10 hover:bg-white/10 
                                    focus:border-yellow-300 focus:ring-0 transition-all duration-300"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="text-right">
                                <Link to="/forgot-password" className="text-white/60 hover:text-yellow-300 text-sm transition-colors duration-300">
                                    Forgot your password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            <p className="text-center text-white/60">
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    className="text-yellow-300 hover:text-yellow-200 font-medium transition-colors duration-300"
                                >
                                    Register here
                                </Link>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login; 