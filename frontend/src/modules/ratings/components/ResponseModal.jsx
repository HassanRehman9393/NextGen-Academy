import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const ResponseModal = ({ isOpen, onClose, onSubmit, initialResponse = '' }) => {
    const [response, setResponse] = useState(initialResponse);
    const [error, setError] = useState('');

    useEffect(() => {
        setResponse(initialResponse);
    }, [initialResponse]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!response.trim()) {
            setError('Response cannot be empty');
            return;
        }

        onSubmit(response);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {initialResponse ? 'Edit Response' : 'Respond to Feedback'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <FiX className="text-white text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white mb-2">Your Response</label>
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-400/50 min-h-[150px] resize-none"
                            placeholder="Write your response..."
                        />
                        {error && (
                            <p className="mt-2 text-red-400 text-sm">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300"
                        >
                            {initialResponse ? 'Update Response' : 'Submit Response'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResponseModal; 