import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const ReplyForm = ({ onSubmit, loading }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Reply content is required');
            return;
        }
        try {
            await onSubmit(content);
            setContent('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                    placeholder="Write your reply..."
                />
                {error && (
                    <p className="mt-1 text-red-300 text-sm">{error}</p>
                )}
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 transform hover:scale-105 transition duration-200 disabled:opacity-50 flex items-center"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin mr-2" />
                            Sending...
                        </>
                    ) : (
                        'Send Reply'
                    )}
                </button>
            </div>
        </form>
    );
};

export default ReplyForm; 