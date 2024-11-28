import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const EmailVerification = () => {
    const [status, setStatus] = useState('verifying');
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/auth/verify-email/${token}`
                );
                
                if (response.ok) {
                    setStatus('success');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <>
                        <FaSpinner className="text-6xl text-yellow-300 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying your email...</h2>
                        <p className="text-white/80">Please wait while we verify your email address.</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <FaCheckCircle className="text-6xl text-green-400 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-white/80">Redirecting to login page...</p>
                    </>
                );
            case 'error':
                return (
                    <>
                        <FaTimesCircle className="text-6xl text-red-400 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-white/80 mb-4">The verification link may be invalid or expired.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 transition duration-200"
                        >
                            Return to Login
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                {/* Logo Section */}
                <div className="flex items-center mb-12">
                    <FaGraduationCap className="text-yellow-300 text-4xl animate-bounce" />
                    <span className="text-white text-2xl font-bold ml-2">NextGen Academy</span>
                </div>

                {/* Content Card */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 text-center">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification; 