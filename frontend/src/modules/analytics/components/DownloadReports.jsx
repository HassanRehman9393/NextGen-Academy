import React from 'react';
import { FiFileText, FiTable, FiLoader } from 'react-icons/fi';

const DownloadButton = ({ onClick, icon: Icon, label, color, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 
            ${color} disabled:opacity-50 disabled:cursor-not-allowed
            hover:shadow-lg hover:scale-105 active:scale-95`}
    >
        {disabled ? (
            <FiLoader className="animate-spin text-lg" />
        ) : (
            <Icon className="text-lg" />
        )}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

const DownloadReports = ({ onDownloadPDF, onDownloadExcel, loading }) => {
    return (
        <div className="flex gap-3">
            <DownloadButton
                onClick={onDownloadPDF}
                icon={FiFileText}
                label="PDF Report"
                color="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400"
                disabled={loading}
            />
            
            <DownloadButton
                onClick={onDownloadExcel}
                icon={FiTable}
                label="Excel Report"
                color="bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-300 hover:to-emerald-400"
                disabled={loading}
            />
        </div>
    );
};

export default DownloadReports; 