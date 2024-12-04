import React, { createContext, useContext, useState, useCallback } from 'react';
import studentForumService from '../services/studentForumService';

const StudentForumContext = createContext();

export const StudentForumProvider = ({ children }) => {
    const [forums, setForums] = useState([]);
    const [selectedForum, setSelectedForum] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });

    const fetchForums = useCallback(async (page = 1, courseId = null) => {
        try {
            setLoading(true);
            const response = await studentForumService.getAllForums(page, 10, courseId);
            setForums(response.data.forums);
            setPagination({
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                total: response.data.total
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchForumDetails = useCallback(async (forumId) => {
        try {
            setLoading(true);
            const response = await studentForumService.getForumDetails(forumId);
            setSelectedForum(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addComment = useCallback(async (forumId, content) => {
        try {
            setLoading(true);
            const response = await studentForumService.addComment(forumId, content);
            setSelectedForum(prev => ({
                ...prev,
                comments: [...prev.comments, response.data]
            }));
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        forums,
        selectedForum,
        loading,
        error,
        pagination,
        fetchForums,
        fetchForumDetails,
        addComment
    };

    return (
        <StudentForumContext.Provider value={value}>
            {children}
        </StudentForumContext.Provider>
    );
};

export const useStudentForum = () => {
    const context = useContext(StudentForumContext);
    if (!context) {
        throw new Error('useStudentForum must be used within a StudentForumProvider');
    }
    return context;
}; 