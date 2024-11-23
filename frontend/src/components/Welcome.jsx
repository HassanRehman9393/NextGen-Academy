import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-blue-700 text-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Welcome to NextGen Academy
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-indigo-100">
                        Empowering the next generation of digital innovators
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/login"
                            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <h3 className="text-xl font-semibold mb-4">Interactive Learning</h3>
                        <p className="text-indigo-100">
                            Engage with our cutting-edge curriculum designed for modern learners
                        </p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <h3 className="text-xl font-semibold mb-4">Expert Instructors</h3>
                        <p className="text-indigo-100">
                            Learn from industry professionals with real-world experience
                        </p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                        <h3 className="text-xl font-semibold mb-4">Flexible Schedule</h3>
                        <p className="text-indigo-100">
                            Study at your own pace with our flexible learning programs
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-0 w-full py-6 text-center bg-black/20">
                <p className="text-sm text-indigo-100">
                    © 2024 NextGen Academy. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Welcome; 