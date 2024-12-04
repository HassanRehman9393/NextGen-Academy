import React, { createContext, useContext, useState } from 'react';
import forumService from '../services/forumService';

const ForumContext = createContext();

export const useForumContext = () => {
    const context = useContext(ForumContext);
    if (!context) {
        throw new Error('useForumContext must be used within a ForumProvider');
    }
    return context;
};

export const ForumProvider = ({ children }) => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentForum, setCurrentForum] = useState(null);

    const fetchForums = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await forumService.fetchForums(page, limit);
            
            if (response.success) {
                setForums(response.data.forums || []);
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to fetch forums');
            }
        } catch (error) {
            console.error('Error fetching forums:', error);
            setError(error.message || 'Failed to fetch forums');
            setForums([]);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createForum = async (forumData) => {
        try {
            setLoading(true);
            const response = await forumService.createForum(forumData);
            setForums([response.data, ...forums]);
            return response.data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addReply = async (forumId, commentId, replyData) => {
        try {
            setLoading(true);
            const response = await forumService.addReply(forumId, commentId, replyData);
            if (currentForum?._id === forumId) {
                setCurrentForum(response.data);
            }
            return response.data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteForum = async (forumId) => {
        try {
            setLoading(true);
            await forumService.deleteForum(forumId);
            setForums(forums.filter(forum => forum._id !== forumId));
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const editForum = async (forumId, forumData) => {
        try {
            setLoading(true);
            const response = await forumService.editForum(forumId, forumData);
            setForums(forums.map(forum => 
                forum._id === forumId ? response.data : forum
            ));
            return response.data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        forums,
        loading,
        error,
        currentForum,
        setCurrentForum,
        fetchForums,
        createForum,
        addReply,
        deleteForum,
        editForum
    };

    return (
        <ForumContext.Provider value={value}>
            {children}
        </ForumContext.Provider>
    );
}; 