import React from 'react';
import { FaEdit, FaTrash, FaEye, FaVideo, FaQuestionCircle, FaGraduationCap } from 'react-icons/fa';
import { useCourse } from '../context/CourseContext';

const CourseItem = ({ course, onView }) => {
    const { 
        setSelectedCourse, 
        setIsEditModalOpen,
        setIsDeleteModalOpen,
        setCourseToDelete
    } = useCourse();

    const handleEdit = () => {
        setSelectedCourse(course);
        setIsEditModalOpen(true);
    };

    const handleDelete = () => {
        setCourseToDelete(course);
        setIsDeleteModalOpen(true);
    };

    const videoCount = course.sequence?.filter(item => item.contentType === 'video').length || 0;
    const quizCount = course.sequence?.filter(item => item.contentType === 'quiz').length || 0;

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:bg-white/[0.15] transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-3 rounded-full">
                        <FaGraduationCap className="text-yellow-300 text-xl" />
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${course.difficultyLevel === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    course.difficultyLevel === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'}`}>
                    {course.difficultyLevel.charAt(0).toUpperCase() + course.difficultyLevel.slice(1)}
                </span>
            </div>

            {/* Content */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-white/60 line-clamp-2">{course.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center text-white/60 mb-1">
                        <FaVideo className="mr-2 text-yellow-300" />
                        <span>Videos</span>
                    </div>
                    <span className="text-xl font-bold text-white">{videoCount}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center text-white/60 mb-1">
                        <FaQuestionCircle className="mr-2 text-yellow-300" />
                        <span>Quizzes</span>
                    </div>
                    <span className="text-xl font-bold text-white">{quizCount}</span>
                </div>
            </div>

            {/* Duration and View Count */}
            <div className="flex justify-between items-center text-white/60 text-sm mb-6">
                <span>{course.totalDuration || 'No content'}</span>
                <span>{course.viewCount || 0} views</span>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
                <button
                    onClick={onView}
                    className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                    <FaEye className="mr-2" />
                    View
                </button>
                <div className="flex space-x-2">
                    <button
                        onClick={handleEdit}
                        className="p-2 hover:bg-yellow-400/20 rounded-lg transition-colors group"
                    >
                        <FaEdit className="text-yellow-300 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                    >
                        <FaTrash className="text-red-400 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseItem;