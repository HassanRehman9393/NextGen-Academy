import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentForum } from '../context/StudentForumContext';
import { formatTimestamp, truncateText } from '../utils/formatUtils';

const ForumSection = () => {
    const navigate = useNavigate();
    const { forums, loading, error, fetchForums } = useStudentForum();

    useEffect(() => {
        fetchForums(1, 5); // Fetch first 5 forums for dashboard
    }, [fetchForums]);

    if (loading) return <div>Loading forums...</div>;
    if (error) return <div>Error loading forums: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Discussion Forums</h2>
                <button
                    onClick={() => navigate('/dashboard/forums')}
                    className="text-blue-500 hover:text-blue-700"
                >
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {forums.length === 0 ? (
                    <p className="text-gray-500">No forums available.</p>
                ) : (
                    forums.slice(0, 5).map(forum => (
                        <div
                            key={forum._id}
                            className="border-b pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                            onClick={() => navigate(`/dashboard/forums/${forum._id}`)}
                        >
                            <h3 className="font-semibold text-lg">{forum.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">
                                {truncateText(forum.description, 150)}
                            </p>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>
                                    By: {forum.instructorId.firstName} {forum.instructorId.lastName}
                                </span>
                                <span>{formatTimestamp(forum.createdAt)}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                                {forum.comments.length} comments
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ForumSection; 