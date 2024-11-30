import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';

const QuestionList = ({ quizId, onEditQuestion }) => {
    const { questions, handleQuestionDelete } = useQuiz();
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        questionId: null,
        questionText: ''
    });
    
    const handleDelete = async (questionId) => {
        try {
            await handleQuestionDelete(questionId);
            console.log('Question deleted successfully');
        } catch (error) {
            console.error('Failed to delete question:', error);
        } finally {
            setDeleteModal({ isOpen: false, questionId: null, questionText: '' });
        }
    };

    const handleEdit = (question) => {
        if (onEditQuestion) {
            onEditQuestion(question);
        }
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center text-white/60 py-8">
                No questions added yet.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {questions.map((question, index) => (
                    <div
                        key={question._id}
                        className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-4"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h4 className="text-white font-medium mb-2">
                                    {index + 1}. {question.questionText}
                                </h4>
                                <div className="space-y-2">
                                    {question.options.map((option, optIndex) => (
                                        <div
                                            key={optIndex}
                                            className={`flex items-center space-x-2 ${
                                                option.isCorrect ? 'text-green-400' : 'text-white/60'
                                            }`}
                                        >
                                            <span className="text-sm">
                                                {String.fromCharCode(65 + optIndex)}.
                                            </span>
                                            <span>{option.text}</span>
                                            {option.isCorrect && (
                                                <span className="text-xs">(Correct)</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {question.explanation && (
                                    <p className="mt-2 text-sm text-white/60">
                                        Explanation: {question.explanation}
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                                <button
                                    onClick={() => handleEdit(question)}
                                    className="p-2 text-white/60 hover:text-white transition-colors"
                                    title="Edit question"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => setDeleteModal({ 
                                        isOpen: true, 
                                        questionId: question._id,
                                        questionText: question.questionText
                                    })}
                                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete question"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, questionId: null, questionText: '' })}
                onConfirm={() => handleDelete(deleteModal.questionId)}
                title="Delete Question"
                message={
                    deleteModal.questionText 
                        ? `Are you sure you want to delete the question: "${deleteModal.questionText}"? This action cannot be undone.`
                        : "Are you sure you want to delete this question? This action cannot be undone."
                }
            />
        </>
    );
};

export default QuestionList; 