import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validatePassword, getPasswordStrength } from '../utils/validation';
import authService from '../services/authService';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear any error messages when user starts typing
        if (status.type === 'error') {
            setStatus({ type: '', message: '' });
        }
    };

    const getPasswordStrengthColor = () => {
        const strength = getPasswordStrength(formData.password);
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const validateForm = () => {
        if (!validatePassword(formData.password)) {
            setStatus({
                type: 'error',
                message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
            });
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setStatus({
                type: 'error',
                message: 'Passwords do not match'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await authService.resetPassword(token, formData.password);
            setStatus({
                type: 'success',
                message: 'Password has been reset successfully'
            });
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login', {
                    state: { message: 'Password reset successful. Please login with your new password.' }
                });
            }, 2000);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'Failed to reset password. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your new password
                    </p>
                </div>

                {status.message && (
                    <div className={`rounded-md p-4 ${
                        status.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                        <p className={`text-sm ${
                            status.type === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                            {status.message}
                        </p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="password" className="sr-only">New Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            {formData.password && (
                                <div className="mt-1">
                                    <div className="h-2 rounded-full bg-gray-200">
                                        <div
                                            className={`h-full rounded-full ${getPasswordStrengthColor()}`}
                                            style={{ width: `${(getPasswordStrength(formData.password) / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                isSubmitting
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting Password...
                                </span>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword; 