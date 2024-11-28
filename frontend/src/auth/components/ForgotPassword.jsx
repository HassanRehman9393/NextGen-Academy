import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            // Your forgot password logic here
            setStatus({
                type: 'success',
                message: 'Password reset instructions sent to your email.'
            });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'Failed to send reset instructions.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                {/* Logo Section */}
                <div className="flex items-center mb-8">
                    <FaGraduationCap className="text-yellow-300 text-4xl animate-bounce" />
                    <span className="text-white text-2xl font-bold ml-2">NextGen Academy</span>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                    <h2 className="text-3xl font-bold text-center text-white mb-8">
                        Reset Your Password
                    </h2>

                    {status.message && (
                        <div className={`mb-6 p-3 rounded-lg ${
                            status.type === 'success' 
                                ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                                : 'bg-red-500/20 border border-red-500/50 text-red-200'
                        } text-sm text-center`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition duration-200 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-white/80">
                        Remember your password?{' '}
                        <Link to="/login" className="text-yellow-300 hover:text-yellow-200 font-semibold">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 