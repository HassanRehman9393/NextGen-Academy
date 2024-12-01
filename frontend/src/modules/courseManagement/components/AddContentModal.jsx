import React, { useState, useEffect } from 'react';
import { FaTimes, FaVideo, FaQuestionCircle, FaPlus } from 'react-icons/fa';
import { useCourse } from '../context/CourseContext';
import videoService from '../../videoManagement/services/videoService';
import quizService from '../../quizManagement/services/quizService';

const AddContentModal = ({ courseId, onClose, onContentAdded }) => {
    const { handleAddContent } = useCourse();
    const [activeTab, setActiveTab] = useState('videos');
    const [videos, setVideos] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const [videosResponse, quizzesResponse] = await Promise.all([
                videoService.getVideos(),
                quizService.getQuizzes()
            ]);

            if (videosResponse.success) {
                setVideos(videosResponse.data);
            }
            if (quizzesResponse.success) {
                setQuizzes(quizzesResponse.data);
            }
        } catch (err) {
            console.error('Error fetching content:', err);
            setError('Failed to load content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (content, type) => {
        if (!courseId) {
            setError('Course ID is required');
            return;
        }

        try {
            setAdding(true);
            setError(null);

            const newContent = {
                contentType: type,
                contentId: content._id,
                contentModel: type === 'video' ? 'Video' : 'Quiz',
                title: content.title,
                duration: content.duration
            };

            console.log('Adding content:', { courseId, newContent });

            const result = await handleAddContent(courseId, newContent);
            
            console.log('Add content result:', result);

            if (result && result.success && result.data) {
                onContentAdded(result.data);
                onClose();
            } else {
                throw new Error(result?.message || 'Failed to update course');
            }
        } catch (err) {
            console.error('Error adding content:', err);
            setError(err.message || 'Failed to add content. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-300 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-700/50 via-indigo-600/50 to-blue-500/50 backdrop-blur-xl rounded-2xl border border-white/20 w-full max-w-4xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Content to Course</h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                            activeTab === 'videos'
                                ? 'bg-yellow-400/20 text-yellow-300'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <FaVideo className="mr-2" />
                        Videos ({videos.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('quizzes')}
                        className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 ${
                            activeTab === 'quizzes'
                                ? 'bg-yellow-400/20 text-yellow-300'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <FaQuestionCircle className="mr-2" />
                        Quizzes ({quizzes.length})
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                        {error}
                    </div>
                )}

                {/* Content List */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {activeTab === 'videos' ? (
                        videos.length === 0 ? (
                            <div className="text-center py-8 text-white/60">
                                No videos available. Upload some videos first.
                            </div>
                        ) : (
                            videos.map(video => (
                                <div
                                    key={video._id}
                                    className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <FaVideo className="text-yellow-300 mr-3" />
                                        <div>
                                            <h3 className="text-white font-medium">{video.title}</h3>
                                            <p className="text-white/60 text-sm">{video.duration || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(video, 'video')}
                                        disabled={adding}
                                        className="p-2 hover:bg-yellow-400/20 rounded-lg transition-colors group disabled:opacity-50"
                                    >
                                        <FaPlus className="text-yellow-300 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            ))
                        )
                    ) : (
                        quizzes.length === 0 ? (
                            <div className="text-center py-8 text-white/60">
                                No quizzes available. Create some quizzes first.
                            </div>
                        ) : (
                            quizzes.map(quiz => (
                                <div
                                    key={quiz._id}
                                    className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <FaQuestionCircle className="text-yellow-300 mr-3" />
                                        <div>
                                            <h3 className="text-white font-medium">{quiz.title}</h3>
                                            <p className="text-white/60 text-sm">
                                                {quiz.questions?.length || 0} questions
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(quiz, 'quiz')}
                                        disabled={adding}
                                        className="p-2 hover:bg-yellow-400/20 rounded-lg transition-colors group disabled:opacity-50"
                                    >
                                        <FaPlus className="text-yellow-300 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddContentModal; 