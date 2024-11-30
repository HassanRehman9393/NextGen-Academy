import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaGoogle, FaGithub } from 'react-icons/fa';
import authService from '../services/authService';

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
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
        setLoading(true);

        try {
            const response = await authService.login(formData);
            console.log('Login response:', response);
            
            await login(response);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
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
                        Welcome Back
                    </h2>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                placeholder="Email address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <Link to="/forgot-password" className="text-yellow-300 hover:text-yellow-200">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-white/60">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSocialLogin('google')}
                                className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition duration-200 text-white group"
                            >
                                <FaGoogle className="text-xl group-hover:text-yellow-300" />
                                <span className="ml-3">Google</span>
                            </button>

                            <button
                                onClick={() => handleSocialLogin('github')}
                                className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition duration-200 text-white group"
                            >
                                <FaGithub className="text-xl group-hover:text-yellow-300" />
                                <span className="ml-3">GitHub</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-white/80">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-yellow-300 hover:text-yellow-200 font-semibold">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 