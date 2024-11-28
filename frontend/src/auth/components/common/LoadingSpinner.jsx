import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-white/20 border-t-yellow-300 rounded-full animate-spin"></div>
                {/* Inner ring */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-white/30 border-t-orange-400 rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner; 