import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiBarChart2, FiArrowLeft } from 'react-icons/fi';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import AnalyticsGraphs from './AnalyticsGraphs';
import DownloadReports from './DownloadReports';

const Analytics = () => {
    const { courseId } = useParams();
    const { data, loading, error, downloadReport } = useAnalyticsData(courseId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 p-8">
                <div className="text-white text-center">Loading analytics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 p-8">
                <div className="text-red-400 text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/instructor/analytics"
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <FiArrowLeft className="text-2xl" />
                        </Link>
                        <FiBarChart2 className="text-3xl text-yellow-300" />
                        <h1 className="text-2xl font-bold text-white">Course Analytics</h1>
                    </div>
                    <DownloadReports
                        onDownloadPDF={() => downloadReport('pdf')}
                        onDownloadExcel={() => downloadReport('excel')}
                        loading={loading}
                    />
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h3 className="text-white/60">Total Enrollments</h3>
                        <p className="text-3xl font-bold text-white">{data?.enrollmentCount || 0}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h3 className="text-white/60">Average Rating</h3>
                        <p className="text-3xl font-bold text-white">{data?.averageRating?.toFixed(1) || 0}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
                        <h3 className="text-white/60">Completion Rate</h3>
                        <p className="text-3xl font-bold text-white">
                            {((data?.completionCount / data?.enrollmentCount) * 100 || 0).toFixed(1)}%
                        </p>
                    </div>
                </div>

                {/* Graphs */}
                <AnalyticsGraphs analytics={data} />
            </div>
        </div>
    );
};

export default Analytics; 