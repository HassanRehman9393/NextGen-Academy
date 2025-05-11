import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import authService from '../services/authService';
import AuthBackground from './AuthBackground';
import { motion } from 'framer-motion';

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


const PASSWORD_REQUIREMENTS = [
    { text: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { text: 'At least one lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { text: 'At least one uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { text: 'At least one number', test: (pwd) => /[0-9]/.test(pwd) },
    { text: 'At least one special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
];


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
    const [success, setSuccess] = useState('');

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

        // Validate password meets all requirements
        const failedRequirements = PASSWORD_REQUIREMENTS.filter(req => !req.test(formData.password));
        if (failedRequirements.length > 0) {
            setError(`Password does not meet requirements: ${failedRequirements.map(r => r.text.toLowerCase()).join(', ')}`);
            setLoading(false);
            return;
        }


        try {
            const response = await authService.register(formData);
            
            if (response.success) {
                setSuccess('Registration successful! Please check your email to verify your account.');
                // Optionally redirect to login page after a delay
                setTimeout(() => {
                    navigate('/auth/login');
                }, 5000);
            }
        } catch (err) {

            setError(err.message || 'Registration failed');

            console.error('Registration error:', err);
            // Handle array of errors or single error message
            if (err.message && err.message.includes('errors')) {
                try {
                    const errorData = JSON.parse(err.message);
                    if (Array.isArray(errorData.errors)) {
                        setError(errorData.errors.join(', '));
                    } else {
                        setError(err.message);
                    }
                } catch (e) {
                    setError(err.message);
                }
            } else {
                setError(err.message || 'Registration failed');
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 relative overflow-hidden">
            <AuthBackground />
            
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
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

                    {/* Registration Form */}
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:bg-white/10 hover:bg-white/10 focus:border-yellow-300 focus:ring-0 transition-all duration-300"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:bg-white/10 hover:bg-white/10 focus:border-yellow-300 focus:ring-0 transition-all duration-300"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:bg-white/10 hover:bg-white/10 focus:border-yellow-300 focus:ring-0 transition-all duration-300"
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
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:bg-white/10 hover:bg-white/10 focus:border-yellow-300 focus:ring-0 transition-all duration-300"
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
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            {PASSWORD_REQUIREMENTS.map((req, index) => (
                                                <div key={index} className="flex items-center text-xs">
                                                    <div className={`w-2 h-2 rounded-full mr-1 ${req.test(formData.password) ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                                    <span className={req.test(formData.password) ? 'text-green-300' : 'text-gray-400'}>{req.text}</span>
                                                </div>
                                            ))}
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
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:bg-white/10 hover:bg-white/10 focus:border-yellow-300 focus:ring-0 transition-all duration-300"
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
                                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transform hover:scale-[1.02] transition-all duration-300"
                            >
                                Create Account
                            </button>

                            <div className="mt-6 text-center text-white/80">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors duration-300"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                        <div className="mt-6 text-white/80">
                            <h3 className="text-lg font-semibold">Password Requirements:</h3>
                            <ul className="list-disc list-inside">
                                {PASSWORD_REQUIREMENTS.map((req, index) => (
                                    <li key={index} className={req.test(formData.password) ? 'text-green-400' : 'text-red-400'}>
                                        {req.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};


export default Register; 
