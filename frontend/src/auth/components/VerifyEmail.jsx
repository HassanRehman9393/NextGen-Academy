import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const VerifyEmail = () => {
    const [status, setStatus] = useState({
        type: 'loading',
        message: 'Verifying your email...'
    });
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await authService.verifyEmail(token);
                setStatus({
                    type: 'success',
                    message: 'Email verified successfully!'
                });
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    navigate('/login', {
                        state: { message: 'Email verified successfully. You can now log in.' }
                    });
                }, 3000);
            } catch (error) {
                setStatus({
                    type: 'error',
                    message: error.message || 'Verification failed. Please try again.'
                });
            }
        };

        verifyEmail();
    }, [token, navigate]);

    const getStatusColor = () => {
        switch (status.type) {
            case 'loading':
                return 'bg-blue-50 text-blue-800';
            case 'success':
                return 'bg-green-50 text-green-800';
            case 'error':
                return 'bg-red-50 text-red-800';
            default:
                return 'bg-gray-50 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Email Verification
                    </h2>
                </div>

                <div className={`rounded-md p-4 ${getStatusColor()}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {status.type === 'loading' && (
                                <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {status.type === 'success' && (
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                            {status.type === 'error' && (
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                {status.message}
                            </p>
                        </div>
                    </div>
                </div>

                {status.type === 'error' && (
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Return to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail; 