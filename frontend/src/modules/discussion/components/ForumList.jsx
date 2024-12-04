import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForumContext } from '../context/ForumContext';
import { formatTimestamp, truncateText } from '../utils/formatUtils';
import { FaPlus, FaSpinner, FaComments, FaClock, FaEdit, FaTrash } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50">
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="fixed inset-0" onClick={onClose}></div>
                <div 
                    className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-xl border border-white/10 max-w-md w-full transform transition-all duration-300 scale-100 animate-modalSlide relative z-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                <FaTrash className="text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6">
                        <p className="text-white/70 text-base leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
                        >
                            <FaTrash className="text-sm" />
                            <span>Delete Forum</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ForumCard = ({ forum, onDelete, onEdit }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:border-yellow-300/30 transition-all duration-300 overflow-hidden group">
            {/* Card Header */}
            <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                        {forum.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onEdit(forum)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-yellow-300 hover:text-yellow-200 transition-all duration-200"
                            title="Edit forum"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-red-400 hover:text-red-300 transition-all duration-200"
                            title="Delete forum"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>

                {/* Topic Badge */}
                <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-sm">
                        {forum.topic}
                    </span>
                </div>

                {/* Description */}
                <p className="text-white/70 mb-4 line-clamp-3">
                    {truncateText(forum.description, 150)}
                </p>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-black/20 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center text-white/60 text-sm">
                            <FaComments className="mr-2 text-yellow-300" />
                            {forum.comments?.length || 0} Comments
                        </span>
                        <span className="flex items-center text-white/60 text-sm">
                            <FaClock className="mr-2 text-yellow-300" />
                            {formatTimestamp(forum.createdAt)}
                        </span>
                    </div>
                    <Link
                        to={`/instructor/forums/${forum._id}`}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 transition-all duration-200 text-sm font-medium"
                    >
                        View Details
                        <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    onDelete(forum._id);
                    setShowDeleteModal(false);
                }}
                title="Delete Forum"
                message="Are you sure you want to delete this forum? This action cannot be undone."
            />
        </div>
    );
};

const EmptyState = ({ onCreateClick }) => (
    <div className="text-center py-16 px-4">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 max-w-lg mx-auto">
            <FaComments className="mx-auto h-12 w-12 text-yellow-300 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Forums Yet</h3>
            <p className="text-white/60 mb-6">
                Create your first discussion forum to engage with students and foster meaningful conversations.
            </p>
            <button
                onClick={onCreateClick}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition-all duration-200"
            >
                <FaPlus className="mr-2" />
                Create Your First Forum
            </button>
        </div>
    </div>
);

const ForumList = () => {
    const navigate = useNavigate();
    const { forums, loading, fetchForums, deleteForum } = useForumContext();
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadForums = async () => {
            try {
                await fetchForums(page);
            } catch (error) {
                console.error('Error loading forums:', error);
            }
        };

        loadForums();
    }, []);

    const handleDelete = async (forumId) => {
        try {
            await deleteForum(forumId);
        } catch (error) {
            console.error('Error deleting forum:', error);
        }
    };

    const handleEdit = (forum) => {
        navigate(`/instructor/forums/edit/${forum._id}`, { state: { forum } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Discussion Forums</h1>
                            <p className="text-white/60">
                                Create and manage discussion forums to engage with your students
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/instructor/forums/create')}
                            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition-all duration-200 flex items-center"
                        >
                            <FaPlus className="mr-2" />
                            Create Forum
                        </button>
                    </div>
                </div>

                {/* Forums Grid with Loading and Empty States */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <FaSpinner className="text-4xl text-white animate-spin mx-auto mb-4" />
                            <p className="text-white/60">Loading forums...</p>
                        </div>
                    </div>
                ) : forums && forums.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forums.map(forum => (
                            <ForumCard 
                                key={forum._id} 
                                forum={forum}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState onCreateClick={() => navigate('/instructor/forums/create')} />
                )}
            </div>
        </div>
    );
};

export default ForumList; 