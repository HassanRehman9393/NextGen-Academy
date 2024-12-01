import React, { createContext, useContext } from 'react';
import { useCourseManagement } from '../hooks/useCourseManagement';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const {
        courses,
        loading,
        error,
        selectedCourse,
        setSelectedCourse,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        courseToDelete,
        setCourseToDelete,
        isAddContentModalOpen,
        setIsAddContentModalOpen,
        handleCourseCreate,
        handleCourseUpdate,
        handleCourseDelete,
        handleAddContent,
        handleRemoveContent,
        handleReorderContent,
        fetchCourses
    } = useCourseManagement();

    const value = {
        courses,
        loading,
        error,
        selectedCourse,
        setSelectedCourse,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        courseToDelete,
        setCourseToDelete,
        isAddContentModalOpen,
        setIsAddContentModalOpen,
        handleCourseCreate,
        handleCourseUpdate,
        handleCourseDelete,
        handleAddContent,
        handleRemoveContent,
        handleReorderContent,
        fetchCourses
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourse = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourse must be used within a CourseProvider');
    }
    return context;
}; 