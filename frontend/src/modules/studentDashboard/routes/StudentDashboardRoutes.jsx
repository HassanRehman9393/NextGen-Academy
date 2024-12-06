import React from 'react';
import { Outlet } from 'react-router-dom';

const StudentDashboardRoutes = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
            <Outlet />
        </div>
    );
};

export default StudentDashboardRoutes; 