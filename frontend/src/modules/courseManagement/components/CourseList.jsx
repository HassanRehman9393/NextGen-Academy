import React, { useState } from 'react';
import { FaBook, FaVideo, FaQuestionCircle, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useCourse } from '../context/CourseContext';
import EditCourseForm from './EditCourseForm';
import CourseDetailView from './CourseDetailView';

const CourseCard = ({ course, onEdit, onDelete, onView }) => {
    const videoCount = course.sequence?.filter(item => item.contentType === 'video').length || 0;
    const quizCount = course.sequence?.filter(item => item.contentType === 'quiz').length || 0;

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition duration-300">
                        {course.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.difficultyLevel === 'beginner' ? 'bg-green-500/20 text-green-300' :
                        course.difficultyLevel === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                    }`}>
                        {course.difficultyLevel.charAt(0).toUpperCase() + course.difficultyLevel.slice(1)}
                    </span>
                </div>

                <p className="text-white/60 text-sm mb-6 line-clamp-2">
                    {course.description}
                </p>

                <div className="flex items-center space-x-4 mb-6 text-sm text-white/40">
                    <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                        <FaVideo className="mr-2 text-yellow-300/60" />
                        {videoCount} Videos
                    </div>
                    <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                        <FaQuestionCircle className="mr-2 text-yellow-300/60" />
                        {quizCount} Quizzes
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => onView(course)}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition duration-200 flex items-center"
                    >
                        <FaEye className="mr-2" />
                        View
                    </button>
                    <button
                        onClick={() => onEdit(course)}
                        className="px-4 py-2 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 transition duration-200 flex items-center"
                    >
                        <FaEdit className="mr-2" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(course)}
                        className="px-4 py-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition duration-200 flex items-center"
                    >
                        <FaTrash className="mr-2" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const CourseList = () => {
    const { 
        courses, 
        setSelectedCourse, 
        setIsEditModalOpen,
        handleCourseDelete,
        isEditModalOpen,
        selectedCourse
    } = useCourse();

    const [courseToDelete, setCourseToDelete] = useState(null);
    const [viewingCourse, setViewingCourse] = useState(null);

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
    };

    const handleDeleteConfirm = async () => {
        try {
            await handleCourseDelete(courseToDelete._id);
            setCourseToDelete(null);
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    };

    const handleView = (course) => {
        setViewingCourse(course);
    };

    if (viewingCourse) {
        return (
            <CourseDetailView 
                course={viewingCourse} 
                onBack={() => setViewingCourse(null)}
            />
        );
    }

    if (!courses?.length) {
        return (
            <div className="text-center py-16">
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-12 max-w-lg mx-auto transform hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <FaBook className="text-yellow-300 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Courses Available</h3>
                    <p className="text-white/60 text-lg mb-6">Start creating courses to share your knowledge</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <CourseCard
                        key={course._id}
                        course={course}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        onView={handleView}
                    />
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {courseToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-purple-700/50 via-indigo-600/50 to-blue-500/50 backdrop-blur-xl rounded-2xl border border-white/20 w-full max-w-md p-8 shadow-2xl">
                        <div className="text-center">
                            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-400 text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Delete Course</h3>
                            <p className="text-white/60 mb-6">
                                Are you sure you want to delete "{courseToDelete.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setCourseToDelete(null)}
                                    className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition duration-200"
                                >
                                    Delete Course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedCourse && (
                <EditCourseForm />
            )}
        </>
    );
};

export default CourseList; 