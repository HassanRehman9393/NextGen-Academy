import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import authService from '../services/authService';
import AuthBackground from './AuthBackground';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await authService.verifyEmail(token);
                setStatus('success');
                setMessage(response.message || 'Email verified successfully!');
                setTimeout(() => {
                    navigate('/auth/login', { 
                        state: { message: 'Email verified successfully. You can now login.' }
                    });
                }, 5000);
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Verification failed. Please try again.');
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <>
                        <FaSpinner className="text-6xl text-yellow-300 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Verifying Your Email</h2>
                        <p className="text-white/60 text-center">Please wait while we verify your email address...</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <FaCheckCircle className="text-6xl text-green-400 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
                        <p className="text-white/60 text-center mb-8">{message}</p>
                        <p className="text-white/60 text-center">Redirecting to login page...</p>
                    </>
                );
            case 'error':
                return (
                    <>
                        <FaTimesCircle className="text-6xl text-red-400 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
                        <p className="text-white/60 text-center mb-8">{message}</p>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <Link
                                to="/register"
                                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 text-center transition-all duration-300 shadow-lg"
                            >
                                Back to Registration
                            </Link>
                            <Link
                                to="/login"
                                className="text-yellow-300 hover:text-yellow-200 text-center transition-colors duration-300"
                            >
                                Try Logging In
                            </Link>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 relative overflow-hidden">
            <AuthBackground />
            
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Logo Section */}
                    <div className="flex items-center mb-12">
                        <FaGraduationCap className="text-yellow-300 text-4xl mr-2 animate-bounce" />
                        <span className="text-white text-2xl font-bold ml-2">NextGen Academy</span>
                    </div>

                    {/* Content Card */}
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                        <div className="flex flex-col items-center">
                            {renderContent()}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyEmail; 