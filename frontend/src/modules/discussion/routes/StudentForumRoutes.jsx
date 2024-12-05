import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForumCatalog from '../components/ForumCatalog';
import ForumDetailsStudent from '../components/ForumDetailsStudent';
import { StudentForumProvider } from '../context/StudentForumContext';

const StudentForumRoutes = () => {
    return (
        <StudentForumProvider>
            <Routes>
                <Route index element={<ForumCatalog />} />
                <Route path=":forumId" element={<ForumDetailsStudent />} />
            </Routes>
        </StudentForumProvider>
    );
};

export default StudentForumRoutes; 