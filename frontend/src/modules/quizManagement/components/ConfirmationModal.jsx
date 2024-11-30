import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-md w-full mx-4 shadow-xl transform transition-all">
                <div className="flex items-center gap-3 text-yellow-300 mb-4">
                    <FaExclamationTriangle className="text-2xl animate-pulse" />
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                </div>
                
                <p className="text-white/70 mb-6">
                    {message}
                </p>
                
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal; 