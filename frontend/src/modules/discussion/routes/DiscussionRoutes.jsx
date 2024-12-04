import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ForumProvider } from '../context/ForumContext';
import ForumList from '../components/ForumList';
import CreateForum from '../components/CreateForum';
import EditForum from '../components/EditForum';
import ForumDetails from '../components/ForumDetails';

const DiscussionRoutes = () => {
    return (
        <ForumProvider>
            <Routes>
                <Route index element={<ForumList />} />
                <Route path="create" element={<CreateForum />} />
                <Route path="edit/:forumId" element={<EditForum />} />
                <Route path=":forumId" element={<ForumDetails />} />
            </Routes>
        </ForumProvider>
    );
};

export default DiscussionRoutes; 