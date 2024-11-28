import React, { useState } from 'react';
import { useVideo } from '../context/VideoContext';
import { validateVideoForm, validateYoutubeUrl } from '../utils/validation';
import { FaYoutube, FaVideo, FaUpload, FaTimes } from 'react-icons/fa';

const VideoUploadForm = ({ onClose }) => {
    const { handleVideoUpload, handleYoutubeAdd } = useVideo();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: 'file',
        url: '',
        file: null
    });
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        try {
            const validation = validateVideoForm(formData);
            if (!validation.isValid) {
                throw new Error(Object.values(validation.errors)[0]);
            }

            if (formData.type === 'file' && !formData.file) {
                throw new Error('Please select a video file');
            }

            if (formData.type === 'youtube') {
                if (!validateYoutubeUrl(formData.url)) {
                    throw new Error('Please enter a valid YouTube URL');
                }

                await handleYoutubeAdd({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    youtubeUrl: formData.url
                });
            } else {
                await handleVideoUpload({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    type: 'file',
                    file: formData.file
                });
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Video</h2>
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
                {/* Upload Type Selection */}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'file', url: '', file: null }))}
                        className={`flex-1 flex items-center justify-center p-4 rounded-lg border ${
                            formData.type === 'file'
                                ? 'border-yellow-300 bg-yellow-300/10 text-yellow-300'
                                : 'border-white/10 text-white/60 hover:border-white/20'
                        } transition duration-200`}
                    >
                        <FaVideo className="mr-2" />
                        File Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'youtube', url: '' }))}
                        className={`flex-1 flex items-center justify-center p-4 rounded-lg border ${
                            formData.type === 'youtube'
                                ? 'border-red-500 bg-red-500/10 text-red-500'
                                : 'border-white/10 text-white/60 hover:border-white/20'
                        } transition duration-200`}
                    >
                        <FaYoutube className="mr-2" />
                        YouTube Video
                    </button>
                </div>

                {/* Form Fields */}
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

                    {formData.type === 'file' ? (
                        <div>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="video-upload"
                            />
                            <label
                                htmlFor="video-upload"
                                className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-white/20 rounded-lg hover:border-yellow-300/50 transition duration-200 text-white/60 hover:text-white cursor-pointer"
                            >
                                <FaUpload className="mr-2" />
                                <span>
                                    {formData.file ? formData.file.name : 'Choose video file'}
                                </span>
                            </label>
                        </div>
                    ) : (
                        <input
                            type="url"
                            placeholder="YouTube URL"
                            value={formData.url}
                            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition duration-200"
                        />
                    )}
                </div>

                {/* Submit Button */}
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
                        disabled={uploading}
                        className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        {uploading ? 'Uploading...' : 'Upload Video'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VideoUploadForm; 