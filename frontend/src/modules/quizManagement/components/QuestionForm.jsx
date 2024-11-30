import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import quizService from '../services/quizService';

const QuestionForm = ({ quizId, onClose, questionToEdit }) => {
    const { handleQuestionAdd, handleQuestionUpdate } = useQuiz();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        questionText: questionToEdit?.questionText || '',
        questionType: questionToEdit?.questionType || 'multiple-choice',
        options: questionToEdit?.options || [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
        ],
        points: questionToEdit?.points || 1,
        explanation: questionToEdit?.explanation || '',
        order: questionToEdit?.order || 0
    });

    useEffect(() => {
        if (questionToEdit) {
            setFormData({
                questionText: questionToEdit.questionText,
                questionType: questionToEdit.questionType,
                options: questionToEdit.options,
                points: questionToEdit.points,
                explanation: questionToEdit.explanation || '',
                order: questionToEdit.order
            });
        }
    }, [questionToEdit]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleOptionChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => 
                i === index ? { ...opt, [field]: value } : field === 'isCorrect' && value ? { ...opt, isCorrect: false } : opt
            )
        }));
    };

    const addOption = () => {
        if (formData.options.length < 6) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, { text: '', isCorrect: false }]
            }));
        }
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            setFormData(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.questionText.trim()) {
            errors.questionText = 'Question text is required';
        }

        const hasCorrectAnswer = formData.options.some(opt => opt.isCorrect);
        const allOptionsHaveText = formData.options.every(opt => opt.text.trim());

        if (!hasCorrectAnswer) {
            errors.options = 'At least one correct answer is required';
        }
        if (!allOptionsHaveText) {
            errors.options = 'All options must have text';
        }

        if (formData.questionType === 'true-false' && formData.options.length !== 2) {
            errors.options = 'True/False questions must have exactly two options';
        }

        if (formData.points < 1) {
            errors.points = 'Points must be at least 1';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const questionData = {
                ...formData,
                order: formData.order || await getNextQuestionOrder()
            };

            if (questionToEdit) {
                await handleQuestionUpdate(questionToEdit._id, questionData);
            } else {
                await handleQuestionAdd(quizId, questionData);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save question:', error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    const getNextQuestionOrder = async () => {
        try {
            const response = await quizService.getQuizQuestions(quizId);
            const questions = response.data || [];
            return questions.length + 1;
        } catch (error) {
            console.error('Error getting question count:', error);
            return 1;
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                    {questionToEdit ? 'Edit Question' : 'Add New Question'}
                </h3>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors"
                >
                    <FaTimes />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Text */}
                <div>
                    <label className="block text-white/80 mb-2">Question Text</label>
                    <textarea
                        name="questionText"
                        value={formData.questionText}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-4 py-2 bg-white/5 border ${
                            errors.questionText ? 'border-red-500' : 'border-white/10'
                        } rounded-lg text-white focus:outline-none focus:border-yellow-300/50`}
                        placeholder="Enter your question"
                    />
                    {errors.questionText && (
                        <p className="mt-1 text-red-400 text-sm">{errors.questionText}</p>
                    )}
                </div>

                {/* Question Type */}
                <div>
                    <label className="block text-white/80 mb-2">Question Type</label>
                    <select
                        name="questionType"
                        value={formData.questionType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-300/50"
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                    </select>
                </div>

                {/* Options */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-white/80">Answer Options</label>
                        {formData.questionType === 'multiple-choice' && formData.options.length < 6 && (
                            <button
                                type="button"
                                onClick={addOption}
                                className="text-yellow-300 hover:text-yellow-400 flex items-center text-sm"
                            >
                                <FaPlus className="mr-1" />
                                Add Option
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {formData.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={option.isCorrect}
                                    onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-yellow-400 focus:ring-yellow-300/50"
                                />
                                <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-300/50"
                                    placeholder={`Option ${index + 1}`}
                                />
                                {formData.options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.options && (
                        <p className="mt-1 text-red-400 text-sm">{errors.options}</p>
                    )}
                </div>

                {/* Points */}
                <div>
                    <label className="block text-white/80 mb-2">Points</label>
                    <input
                        type="number"
                        name="points"
                        value={formData.points}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-300/50"
                    />
                    {errors.points && (
                        <p className="mt-1 text-red-400 text-sm">{errors.points}</p>
                    )}
                </div>

                {/* Explanation */}
                <div>
                    <label className="block text-white/80 mb-2">Explanation (Optional)</label>
                    <textarea
                        name="explanation"
                        value={formData.explanation}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-300/50"
                        placeholder="Explain the correct answer"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:from-yellow-300 hover:to-orange-400 transition-colors ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Saving...' : questionToEdit ? 'Update Question' : 'Add Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionForm; 