import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaLaptopCode, FaUsers, FaCertificate, FaChalkboardTeacher, FaBook } from 'react-icons/fa';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-blue-700">
            {/* Navigation */}
            <nav className="bg-white/10 backdrop-blur-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <FaGraduationCap className="text-white text-3xl" />
                        <span className="text-white text-xl font-bold ml-2">NextGen Academy</span>
                    </div>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition duration-300"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 pt-20 pb-16">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                        Transform Your Future with
                        <span className="block text-yellow-300">NextGen Academy</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-indigo-100 max-w-3xl mx-auto">
                        Unlock your potential with cutting-edge courses, expert instructors, and a 
                        community of passionate learners.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-yellow-400 text-indigo-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition duration-300 shadow-lg"
                    >
                        Start Learning Today
                    </button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-white text-center">
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <div className="text-4xl font-bold">1000+</div>
                        <div className="text-indigo-200">Active Students</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <div className="text-4xl font-bold">100+</div>
                        <div className="text-indigo-200">Expert Instructors</div>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <div className="text-4xl font-bold">50+</div>
                        <div className="text-indigo-200">Courses Available</div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition duration-300">
                        <FaLaptopCode className="text-4xl text-yellow-300 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-4">Interactive Learning</h3>
                        <p className="text-indigo-100">
                            Hands-on projects and interactive content designed to enhance your learning experience.
                        </p>
                    </div>
                    <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition duration-300">
                        <FaChalkboardTeacher className="text-4xl text-yellow-300 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-4">Expert Instruction</h3>
                        <p className="text-indigo-100">
                            Learn from industry professionals with years of real-world experience.
                        </p>
                    </div>
                    <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm transform hover:scale-105 transition duration-300">
                        <FaCertificate className="text-4xl text-yellow-300 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-4">Certification</h3>
                        <p className="text-indigo-100">
                            Earn recognized certificates upon completion of your courses.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center bg-white/10 rounded-2xl p-12 backdrop-blur-sm">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Begin Your Learning Journey?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join thousands of students already learning with NextGen Academy
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-yellow-400 text-indigo-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition duration-300 shadow-lg"
                    >
                        Get Started Now
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black/20 py-8 mt-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex justify-center space-x-6 mb-4">
                        <FaBook className="text-white text-2xl" />
                        <FaUsers className="text-white text-2xl" />
                        <FaGraduationCap className="text-white text-2xl" />
                    </div>
                    <p className="text-indigo-100">
                        © 2024 NextGen Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Welcome; 