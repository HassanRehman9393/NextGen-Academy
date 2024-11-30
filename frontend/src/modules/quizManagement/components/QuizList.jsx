import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { FaEdit, FaTrash, FaClock, FaTrophy, FaList, FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa';
import QuizEditForm from './QuizEditForm';

const DeleteConfirmationModal = ({ quiz, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Quiz</h3>
            <p className="text-white/80 mb-6">
                Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors"
                >
                    Delete Quiz
                </button>
            </div>
        </div>
    </div>
);

const QuizCard = ({ quiz, onEdit, onDelete, onManageQuestions }) => (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition duration-300">
                    {quiz.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    quiz.isPublished 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                    {quiz.isPublished ? (
                        <div className="flex items-center">
                            <FaEye className="mr-1" />
                            Published
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FaEyeSlash className="mr-1" />
                            Draft
                        </div>
                    )}
                </span>
            </div>
            
            <p className="text-white/60 text-sm mb-6 line-clamp-2">
                {quiz.description}
            </p>

            <div className="flex items-center space-x-4 mb-6 text-sm text-white/40">
                <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                    <FaClock className="mr-2 text-yellow-300/60" />
                    {quiz.duration} min
                </div>
                <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                    <FaTrophy className="mr-2 text-yellow-300/60" />
                    {quiz.passingScore}%
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    onClick={() => onEdit(quiz)}
                    className="px-4 py-2 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 transition duration-200 flex items-center"
                >
                    <FaEdit className="mr-2" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(quiz)}
                    className="px-4 py-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition duration-200 flex items-center"
                >
                    <FaTrash className="mr-2" />
                    Delete
                </button>
            </div>
        </div>
        
        <div className="p-4 border-t border-white/10">
            <button
                onClick={() => onManageQuestions(quiz)}
                className="w-full px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 rounded-lg transition-colors flex items-center justify-center"
            >
                <FaPlus className="mr-2" />
                Manage Questions
            </button>
        </div>
    </div>
);

const QuizList = () => {
    const { 
        quizzes, 
        setSelectedQuiz, 
        setIsEditModalOpen,
        handleQuizDelete,
        isEditModalOpen,
        selectedQuiz
    } = useQuiz();

    const [quizToDelete, setQuizToDelete] = useState(null);

    const handleEdit = (quiz) => {
        setSelectedQuiz(quiz);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (quiz) => {
        setQuizToDelete(quiz);
    };

    const handleDeleteConfirm = async () => {
        try {
            await handleQuizDelete(quizToDelete._id);
            setQuizToDelete(null);
        } catch (error) {
            console.error('Failed to delete quiz:', error);
        }
    };

    const handleManageQuestions = (quiz) => {
        setSelectedQuiz(quiz);
        setIsEditModalOpen(true);
    };

    if (!quizzes?.length) {
        return (
            <div className="text-center py-16">
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-12 max-w-lg mx-auto transform hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <FaList className="text-yellow-300 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Quizzes Available</h3>
                    <p className="text-white/60 text-lg mb-6">Start creating quizzes to assess your students' knowledge</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map((quiz) => (
                    <QuizCard
                        key={quiz._id}
                        quiz={quiz}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        onManageQuestions={handleManageQuestions}
                    />
                ))}
            </div>

            {quizToDelete && (
                <DeleteConfirmationModal
                    quiz={quizToDelete}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setQuizToDelete(null)}
                />
            )}

            {isEditModalOpen && selectedQuiz && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-4xl p-8 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                        <QuizEditForm onClose={() => setIsEditModalOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default QuizList; 