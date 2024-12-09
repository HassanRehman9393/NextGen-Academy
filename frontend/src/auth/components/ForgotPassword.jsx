import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import authService from '../services/authService';
import AuthBackground from './AuthBackground';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
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

                    {/* Form Card */}
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Reset Password</h2>

                        {success ? (
                            <div className="text-center">
                                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200">
                                    Password reset instructions have been sent to your email.
                                </div>
                                <Link
                                    to="/login"
                                    className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white 
                                        placeholder-white/50 focus:bg-white/10 hover:bg-white/10 
                                        focus:border-yellow-300 focus:ring-0 transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl 
                                    font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 
                                    focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all 
                                    duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                >
                                    {loading ? 'Sending...' : 'Reset Password'}
                                </button>

                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword; 