import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForumContext } from '../context/ForumContext';
import { validateForumData } from '../utils/validationUtils';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const CreateForum = () => {
    const navigate = useNavigate();
    const { createForum } = useForumContext();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        description: '',
        courseId: ''
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/courses`, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                setCourses(response.data.data || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (errors[e.target.name]) {
            setErrors(prev => ({
                ...prev,
                [e.target.name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateForumData(formData);
        
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        if (!formData.courseId) {
            setErrors(prev => ({
                ...prev,
                courseId: 'Please select a course'
            }));
            return;
        }

        try {
            setLoading(true);
            await createForum(formData);
            navigate('/instructor/forums');
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/instructor/forums')}
                        className="flex items-center text-white/80 hover:text-white mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Forums
                    </button>
                    <h1 className="text-3xl font-bold text-white">Create New Discussion Forum</h1>
                </div>

                {/* Form */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Course Selection */}
                        <div>
                            <label className="block text-white mb-2">Course</label>
                            <select
                                name="courseId"
                                value={formData.courseId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                            >
                                <option value="">Select a course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            {errors.courseId && (
                                <p className="mt-1 text-red-300 text-sm">{errors.courseId}</p>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-white mb-2">Forum Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                                placeholder="Enter forum title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-red-300 text-sm">{errors.title}</p>
                            )}
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="block text-white mb-2">Topic</label>
                            <input
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                                placeholder="Enter forum topic"
                            />
                            {errors.topic && (
                                <p className="mt-1 text-red-300 text-sm">{errors.topic}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-white mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                                placeholder="Enter forum description"
                            />
                            {errors.description && (
                                <p className="mt-1 text-red-300 text-sm">{errors.description}</p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                {errors.submit}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition duration-200 disabled:opacity-50 flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Forum'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateForum; 