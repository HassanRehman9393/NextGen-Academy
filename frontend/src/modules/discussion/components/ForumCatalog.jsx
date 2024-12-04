import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentForum } from '../context/StudentForumContext';
import { formatTimestamp } from '../utils/formatUtils';

const ForumCatalog = () => {
    const navigate = useNavigate();
    const { forums, loading, error, pagination, fetchForums } = useStudentForum();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        fetchForums(1, selectedCourse);
    }, [fetchForums, selectedCourse]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
    };

    const handlePageChange = (page) => {
        fetchForums(page, selectedCourse);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Discussion Forums</h1>
            
            {/* Search and Filter Section */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search forums..."
                        className="flex-1 p-2 border rounded"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                        Search
                    </button>
                </form>
            </div>

            {/* Forums List */}
            <div className="space-y-4">
                {forums.map(forum => (
                    <div 
                        key={forum._id}
                        className="p-4 border rounded hover:shadow-lg cursor-pointer"
                        onClick={() => navigate(`/discussion/forums/${forum._id}`)}
                    >
                        <h2 className="text-xl font-semibold">{forum.title}</h2>
                        <p className="text-gray-600">{forum.topic}</p>
                        <div className="mt-2 text-sm text-gray-500">
                            <span>Posted by: {forum.instructorId.firstName} {forum.instructorId.lastName}</span>
                            <span className="ml-4">{formatTimestamp(forum.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded ${
                            pagination.currentPage === i + 1 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ForumCatalog; 