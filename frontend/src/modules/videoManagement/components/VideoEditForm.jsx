import React, { useState, useEffect } from 'react';
import { useVideo } from '../context/VideoContext';
import { validateVideoForm } from '../utils/validation';
import { FaTimes, FaSave } from 'react-icons/fa';

const VideoEditForm = ({ video, onClose }) => {
    const { handleVideoUpdate } = useVideo();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: ''
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (video) {
            setFormData({
                title: video.title,
                description: video.description,
                category: video.category
            });
        }
    }, [video]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const validation = validateVideoForm(formData);
            if (!validation.isValid) {
                throw new Error(Object.values(validation.errors)[0]);
            }

            await handleVideoUpdate(video._id, formData);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Video</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition duration-200"
                >
                    <FaTimes />
                </button>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Video Title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                    />

                    <textarea
                        placeholder="Video Description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200 resize-none"
                    />

                    <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                    >
                        <option value="">Select Category</option>
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="business">Business</option>
                        <option value="marketing">Marketing</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg border border-white/10 text-white/60 hover:bg-white/5 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        <FaSave className="mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VideoEditForm; 