import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getValidationErrors, getPasswordStrength } from '../utils/validation';
import { FaGraduationCap } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const { handleRegister } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const getPasswordStrengthColor = () => {
        const strength = getPasswordStrength(formData.password);
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = getValidationErrors(formData);
        
        if (Object.keys(validationErrors).length === 0) {
            try {
                await handleRegister(formData);
            } catch (error) {
                setErrors({
                    submit: error.message || 'Registration failed. Please try again.'
                });
            }
        } else {
            setErrors(validationErrors);
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
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-300">{errors.firstName}</p>
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
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-300">{errors.lastName}</p>
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
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-300">{errors.email}</p>
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
                                            className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{ width: `${(getPasswordStrength(formData.password) / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-300">{errors.password}</p>
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
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="text-sm text-red-300 text-center">
                                {errors.submit}
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