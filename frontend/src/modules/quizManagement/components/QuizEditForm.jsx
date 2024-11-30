import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { FaTimes, FaPlus, FaSave } from 'react-icons/fa';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';

const QuizEditForm = ({ onClose }) => {
    const { 
        selectedQuiz, 
        handleQuizUpdate,
        setSelectedQuiz
    } = useQuiz();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [formData, setFormData] = useState({
        title: selectedQuiz?.title || '',
        topic: selectedQuiz?.topic || '',
        description: selectedQuiz?.description || '',
        duration: selectedQuiz?.duration || 30,
        passingScore: selectedQuiz?.passingScore || 70,
        isPublished: selectedQuiz?.isPublished || false
    });

    useEffect(() => {
        if (selectedQuiz) {
            setFormData({
                title: selectedQuiz.title,
                topic: selectedQuiz.topic,
                description: selectedQuiz.description,
                duration: selectedQuiz.duration,
                passingScore: selectedQuiz.passingScore,
                isPublished: selectedQuiz.isPublished
            });
        }
    }, [selectedQuiz]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.topic.trim()) errors.topic = 'Topic is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (formData.duration < 1) errors.duration = 'Duration must be at least 1 minute';
        if (formData.passingScore < 0 || formData.passingScore > 100) {
            errors.passingScore = 'Passing score must be between 0 and 100';
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
            await handleQuizUpdate(selectedQuiz._id, formData);
            onClose();
        } catch (error) {
            console.error('Failed to update quiz:', error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Quiz</h2>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors"
                >
                    <FaTimes className="text-xl" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quiz Details Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white/80 mb-2" htmlFor="title">
                                Quiz Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-white/5 border ${
                                    errors.title ? 'border-red-500' : 'border-white/10'
                                } rounded-lg text-white focus:outline-none focus:border-yellow-300/50`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-red-400 text-sm">{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white/80 mb-2" htmlFor="topic">
                                Topic
                            </label>
                            <input
                                type="text"
                                id="topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 bg-white/5 border ${
                                    errors.topic ? 'border-red-500' : 'border-white/10'
                                } rounded-lg text-white focus:outline-none focus:border-yellow-300/50`}
                            />
                            {errors.topic && (
                                <p className="mt-1 text-red-400 text-sm">{errors.topic}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-white/80 mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-4 py-2 bg-white/5 border ${
                                    errors.description ? 'border-red-500' : 'border-white/10'
                                } rounded-lg text-white focus:outline-none focus:border-yellow-300/50`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-red-400 text-sm">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/80 mb-2" htmlFor="duration">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    className={`w-full px-4 py-2 bg-white/5 border ${
                                        errors.duration ? 'border-red-500' : 'border-white/10'
                                    } rounded-lg text-white focus:outline-none focus:border-yellow-300/50`}
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-red-400 text-sm">{errors.duration}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white/80 mb-2" htmlFor="passingScore">
                                    Passing Score (%)
                                </label>
                                <input
                                    type="number"
                                    id="passingScore"
                                    name="passingScore"
                                    value={formData.passingScore}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className={`w-full px-4 py-2 bg-white/5 border ${
                                        errors.passingScore ? 'border-red-500' : 'border-white/10'
                                    } rounded-lg text-white focus:outline-none focus:border-yellow-300/50`}
                                />
                                {errors.passingScore && (
                                    <p className="mt-1 text-red-400 text-sm">{errors.passingScore}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isPublished"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-yellow-400 focus:ring-yellow-300/50"
                            />
                            <label className="text-white/80" htmlFor="isPublished">
                                Publish Quiz
                            </label>
                        </div>

                        {errors.submit && (
                            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg">
                                {errors.submit}
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:from-yellow-300 hover:to-orange-400 transition-colors flex items-center ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <FaSave className="mr-2" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Questions Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Questions</h3>
                        <button
                            onClick={() => setShowQuestionForm(true)}
                            className="flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 text-yellow-300 rounded-lg transition-colors"
                        >
                            <FaPlus className="mr-2" />
                            Add Question
                        </button>
                    </div>

                    {showQuestionForm ? (
                        <QuestionForm
                            quizId={selectedQuiz._id}
                            onClose={() => setShowQuestionForm(false)}
                        />
                    ) : (
                        <QuestionList quizId={selectedQuiz._id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizEditForm; 