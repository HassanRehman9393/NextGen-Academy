import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaGraduationCap, FaUsers, FaClock, FaBook, FaQuestionCircle } from 'react-icons/fa';

const CourseCard = ({ course }) => {
    const {
        _id,
        title,
        description,
        instructor,
        difficultyLevel,
        rating = 0,
        enrollmentCount = 0,
        totalDuration,
        totalVideos = 0,
        totalQuizzes = 0
    } = course;

    const getDifficultyColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner':
                return 'bg-green-400/10 text-green-400 border-green-400/20';
            case 'intermediate':
                return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
            case 'advanced':
                return 'bg-red-400/10 text-red-400 border-red-400/20';
            default:
                return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
        }
    };

    return (
        <Link
            to={`/dashboard/courses/${_id}`}
            className="block group"
        >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-yellow-300/30 hover:scale-[1.02] hover:shadow-xl p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-white/80 flex items-center">
                            <FaGraduationCap className="mr-2" />
                            {instructor?.firstName} {instructor?.lastName}
                        </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(difficultyLevel)}`}>
                        {difficultyLevel || 'All Levels'}
                    </span>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm line-clamp-2 mb-6">
                    {description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                        {/* Rating */}
                        <div className="flex items-center text-yellow-300">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={`w-4 h-4 ${
                                            index < Math.floor(rating)
                                                ? 'text-yellow-300'
                                                : 'text-white/10'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
                        </div>
                        
                        {/* Duration */}
                        {totalDuration && (
                            <div className="flex items-center text-white/70">
                                <FaClock className="mr-2" />
                                <span className="text-sm">{totalDuration}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 text-right">
                        {/* Enrollment Count */}
                        <div className="flex items-center justify-end text-white/70">
                            <FaUsers className="mr-2" />
                            <span className="text-sm">{enrollmentCount} enrolled</span>
                        </div>
                        
                        {/* Content Count */}
                        <div className="flex items-center justify-end space-x-4 text-white/70">
                            <div className="flex items-center">
                                <FaBook className="mr-1" />
                                <span className="text-sm">{totalVideos}</span>
                            </div>
                            <div className="flex items-center">
                                <FaQuestionCircle className="mr-1" />
                                <span className="text-sm">{totalQuizzes}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar (if enrolled) */}
                {course.progress !== undefined && (
                    <div className="mt-4">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-yellow-300 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-white/60 mt-1">
                            {course.progress}% Complete
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default CourseCard; 