import React from 'react';
import { FaArrowLeft, FaVideo, FaQuestionCircle, FaGraduationCap, FaEdit, FaTrash } from 'react-icons/fa';
import { useCourse } from '../context/CourseContext';

const CourseDetailView = ({ course, onBack }) => {
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
        onBack(); // Return to course list when initiating delete
    };

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'beginner':
                return 'bg-green-500/20 text-green-400';
            case 'intermediate':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'advanced':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-white/60 hover:text-white transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Courses
                </button>
                <div className="flex space-x-3">
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors flex items-center"
                    >
                        <FaEdit className="mr-2" />
                        Edit Course
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-colors flex items-center"
                    >
                        <FaTrash className="mr-2" />
                        Delete Course
                    </button>
                </div>
            </div>

            {/* Course Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-3 rounded-full mr-4">
                            <FaGraduationCap className="text-yellow-300 text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficultyLevel)}`}>
                                {course.difficultyLevel.charAt(0).toUpperCase() + course.difficultyLevel.slice(1)}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                                {course.sequence?.filter(item => item.contentType === 'video').length || 0}
                            </div>
                            <div className="text-white/60 text-sm">Videos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                                {course.sequence?.filter(item => item.contentType === 'quiz').length || 0}
                            </div>
                            <div className="text-white/60 text-sm">Quizzes</div>
                        </div>
                    </div>
                </div>

                <p className="text-white/80 mb-6">{course.description}</p>

                <div className="border-t border-white/10 pt-6">
                    <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>
                    <div className="space-y-3">
                        {!course.sequence?.length ? (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
                                <p className="text-white/60">No content added to this course yet.</p>
                            </div>
                        ) : (
                            course.sequence.map((item, index) => (
                                <div
                                    key={`${item.contentType}-${item.contentId}`}
                                    className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <span className="w-8 h-8 flex items-center justify-center bg-yellow-300/20 rounded-full text-yellow-300 mr-4">
                                            {index + 1}
                                        </span>
                                        <div className="flex items-center">
                                            {item.contentType === 'video' ? (
                                                <FaVideo className="text-yellow-300 mr-3" />
                                            ) : (
                                                <FaQuestionCircle className="text-yellow-300 mr-3" />
                                            )}
                                            <div>
                                                <h4 className="text-white font-medium">{item.title}</h4>
                                                <p className="text-white/40 text-sm">
                                                    {item.contentType === 'video' ? 'Video Lesson' : 'Quiz Assessment'}
                                                    {item.duration && ` • ${item.duration}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailView; 