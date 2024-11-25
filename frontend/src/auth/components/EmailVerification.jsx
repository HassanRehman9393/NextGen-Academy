import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
    const [status, setStatus] = useState('verifying');
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/auth/verify-email/${token}`
                );
                
                setStatus('success');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {status === 'verifying' && (
                    <div className="text-center">
                        <h2 className="text-xl font-bold">Verifying your email...</h2>
                        {/* Add a loading spinner here */}
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="text-center text-green-600">
                        <h2 className="text-xl font-bold">Email verified successfully!</h2>
                        <p>Redirecting to login page...</p>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="text-center text-red-600">
                        <h2 className="text-xl font-bold">Verification failed</h2>
                        <p>The verification link may be invalid or expired.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 text-blue-600 hover:text-blue-800"
                        >
                            Return to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification; 