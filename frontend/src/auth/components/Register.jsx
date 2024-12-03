import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import authService from '../services/authService';

const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength++;
    return strength;
};

const getPasswordStrengthColor = (password) => {
    const strength = getPasswordStrength(password);
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
};

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                navigate('/login', { 
                    state: { 
                        message: 'Registration successful! Please check your email to verify your account.' 
                    }
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to register');
        } finally {
            setLoading(false);
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
                        Create Your Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {error && (
                                    <p className="mt-1 text-sm text-red-300">{error}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {error && (
                                    <p className="mt-1 text-sm text-red-300">{error}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {error && (
                                <p className="mt-1 text-sm text-red-300">{error}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="h-1.5 rounded-full bg-white/10">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(formData.password)}`}
                                            style={{ width: `${(getPasswordStrength(formData.password) / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <p className="mt-1 text-sm text-red-300">{error}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {error && (
                                <p className="mt-1 text-sm text-red-300">{error}</p>
                            )}
                        </div>

                        {error && (
                            <div className="text-sm text-red-300 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition duration-200"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center text-white/80">
                        Already have an account?{' '}
                        <Link to="/login" className="text-yellow-300 hover:text-yellow-200 font-semibold">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register; 