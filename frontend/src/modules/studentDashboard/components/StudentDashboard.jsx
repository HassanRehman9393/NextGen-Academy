import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import ForumSection from '../../discussion/components/ForumSection';
// Import other dashboard components...

const StudentDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <Routes>
                            <Route path="/" element={
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Other dashboard sections */}
                                    <div className="md:col-span-2">
                                        <ForumSection />
                                    </div>
                                </div>
                            } />
                            {/* Other dashboard routes */}
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard; 