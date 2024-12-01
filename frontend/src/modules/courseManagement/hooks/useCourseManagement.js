import { useState, useCallback, useEffect } from 'react';
import courseService from '../services/courseService';

export const useCourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await courseService.getCourses();
            if (response.success) {
                setCourses(response.data);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleCourseCreate = async (courseData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await courseService.createCourse(courseData);
            if (response.success) {
                await fetchCourses();
                setIsCreateModalOpen(false);
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleCourseUpdate = async (courseId, courseData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await courseService.updateCourse(courseId, courseData);
            if (response.success) {
                await fetchCourses();
                setIsEditModalOpen(false);
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleCourseDelete = async (courseId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await courseService.deleteCourse(courseId);
            if (response.success) {
                await fetchCourses();
                setIsDeleteModalOpen(false);
                setCourseToDelete(null);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleAddContent = async (courseId, contentData) => {
        if (!courseId) {
            setError('Course ID is required');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log('Handling add content:', { courseId, contentData });

            const response = await courseService.addContent(courseId, contentData);

            console.log('Service response:', response);

            if (response.success) {
                setCourses(prevCourses => 
                    prevCourses.map(course => 
                        course._id === courseId ? response.data : course
                    )
                );

                if (selectedCourse?._id === courseId) {
                    setSelectedCourse(response.data);
                }

                setIsAddContentModalOpen(false);
                return response;
            } else {
                throw new Error(response.message || 'Failed to add content');
            }
        } catch (err) {
            console.error('Hook error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveContent = async (courseId, contentIndex) => {
        setLoading(true);
        setError(null);
        try {
            const response = await courseService.removeContent(courseId, contentIndex);
            
            if (response.success) {
                setCourses(prevCourses => 
                    prevCourses.map(course => 
                        course._id === courseId ? response.data : course
                    )
                );

                if (selectedCourse?._id === courseId) {
                    setSelectedCourse(response.data);
                }

                return response.data;
            } else {
                throw new Error(response.message || 'Failed to remove content');
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleReorderContent = async (courseId, fromIndex, toIndex) => {
        setLoading(true);
        setError(null);
        try {
            const response = await courseService.reorderContent(courseId, fromIndex, toIndex);
            if (response.success) {
                await fetchCourses();
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
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
        fetchCourses,
        handleCourseCreate,
        handleCourseUpdate,
        handleCourseDelete,
        handleAddContent,
        handleRemoveContent,
        handleReorderContent
    };
}; 