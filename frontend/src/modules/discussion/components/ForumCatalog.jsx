import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentForum } from '../context/StudentForumContext';
import { formatTimestamp } from '../utils/formatUtils';
import { FaComments, FaSearch, FaSpinner, FaBook, FaUser, FaClock } from 'react-icons/fa';
import StudentLayout from '../../studentDashboard/components/StudentLayout';

const ForumCatalog = () => {
    const navigate = useNavigate();
    const { forums, loading, error, pagination, fetchForums } = useStudentForum();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        const loadForums = async () => {
            try {
                await fetchForums(1, selectedCourse);
            } catch (err) {
                console.error('Error loading forums:', err);
            }
        };
        
        loadForums();
    }, [selectedCourse]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchForums(1, selectedCourse, searchTerm);
    };

    return (
        <StudentLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4 md:mb-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Discussion Forums</h1>
                        <p className="text-white/60 text-sm md:text-base">
                            Engage with your instructors and fellow students in meaningful discussions
                        </p>
                    </div>
                </div>

                {/* Search Section */}
                <div className="mb-4 md:mb-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10">
                        <form onSubmit={handleSearch} className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search forums..."
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-300/50"
                            />
                        </form>
                    </div>
                </div>

                {/* Forums List */}
                <div className="space-y-4">
                    {forums && forums.length > 0 ? (
                        forums.map(forum => (
                            <div 
                                key={forum._id}
                                onClick={() => navigate(`/dashboard/forums/${forum._id}`)}
                                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-yellow-300/30 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-lg md:text-xl font-semibold text-white group-hover:text-yellow-300 transition-colors">
                                                {forum.title}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-white/60">
                                                <span className="flex items-center">
                                                    <FaBook className="mr-2 text-yellow-400" />
                                                    {forum.topic}
                                                </span>
                                                <span className="flex items-center">
                                                    <FaUser className="mr-2 text-yellow-400" />
                                                    {forum.instructorId.firstName} {forum.instructorId.lastName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-white/40 text-sm">
                                            <span className="flex items-center">
                                                <FaClock className="mr-2 text-yellow-400" />
                                                {formatTimestamp(forum.createdAt)}
                                            </span>
                                            <span className="flex items-center text-yellow-300">
                                                <FaComments className="mr-2" />
                                                {forum.comments?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-white/70 line-clamp-2 text-sm md:text-base">
                                        {forum.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 md:py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                            <FaComments className="mx-auto text-3xl md:text-4xl text-yellow-400 mb-4" />
                            <p className="text-white/60">No forums available</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
};

export default ForumCatalog; 