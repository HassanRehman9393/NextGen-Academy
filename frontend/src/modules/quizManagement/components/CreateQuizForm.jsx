import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { FaTimes } from 'react-icons/fa';

const CreateQuizForm = ({ onClose }) => {
    const { handleQuizCreate } = useQuiz();
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        description: '',
        duration: 30,
        passingScore: 70,
        isPublished: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.duration < 1) newErrors.duration = 'Duration must be at least 1 minute';
        if (formData.passingScore < 0 || formData.passingScore > 100) {
            newErrors.passingScore = 'Passing score must be between 0 and 100';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await handleQuizCreate(formData);
            onClose();
        } catch (err) {
            console.error('Failed to create quiz:', err);
            setError(err.message || 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={onClose}
                className="absolute right-0 top-0 p-2 text-white/60 hover:text-white transition-colors"
            >
                <FaTimes className="text-xl" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Create New Quiz</h2>

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
                        placeholder="Enter quiz title"
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
                        placeholder="Enter quiz topic"
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
                        placeholder="Enter quiz description"
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

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-lg">
                        {error}
                    </div>
                )}

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
                        {loading ? 'Creating...' : 'Create Quiz'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuizForm; 