const CourseService = require('../services/courseService');
const { validateCourse } = require('../utils/validation');
const SequenceUtils = require('../utils/sequenceUtils');

class CourseController {
    async createCourse(req, res) {
        try {
            const { error } = validateCourse(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const course = await CourseService.createCourse(req.body, req.user._id);
            res.status(201).json({
                success: true,
                data: course
            });
        } catch (error) {
            console.error('Create course error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create course'
            });
        }
    }

    async getCourses(req, res) {
        try {
            const courses = await CourseService.getCoursesByInstructor(req.user._id);
            res.json({
                success: true,
                data: courses,
                count: courses.length
            });
        } catch (error) {
            console.error('Get courses error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch courses'
            });
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await CourseService.getCourseById(req.params.id, req.user._id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            res.json({
                success: true,
                data: course
            });
        } catch (error) {
            console.error('Get course by ID error:', error);
            const status = error.message.includes('not found') ? 404 : 500;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateCourse(req, res) {
        try {
            const { error } = validateCourse(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const course = await CourseService.updateCourse(
                req.params.id,
                req.body,
                req.user._id
            );

            res.json({
                success: true,
                data: course,
                message: 'Course updated successfully'
            });
        } catch (error) {
            console.error('Update course error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to update course'
            });
        }
    }

    async deleteCourse(req, res) {
        try {
            await CourseService.deleteCourse(req.params.id, req.user._id);
            res.json({
                success: true,
                message: 'Course deleted successfully'
            });
        } catch (error) {
            console.error('Delete course error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to delete course'
            });
        }
    }

    async addContent(req, res) {
        try {
            if (!req.body.contentType || !req.body.contentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Content type and ID are required'
                });
            }

            const { courseId } = req.params;
            const updatedCourse = await CourseService.addContent(
                courseId,
                req.body,
                req.user._id
            );

            res.json({
                success: true,
                data: updatedCourse,
                message: 'Content added successfully'
            });
        } catch (error) {
            console.error('Add content error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to add content'
            });
        }
    }

    async removeContent(req, res) {
        try {
            const { courseId, contentIndex } = req.params;
            if (isNaN(contentIndex)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid content index'
                });
            }

            const course = await CourseService.removeContent(
                courseId,
                parseInt(contentIndex),
                req.user._id
            );

            res.json({
                success: true,
                data: course,
                message: 'Content removed successfully'
            });
        } catch (error) {
            console.error('Remove content error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to remove content'
            });
        }
    }

    async reorderContent(req, res) {
        try {
            const { courseId } = req.params;
            const { fromIndex, toIndex } = req.body;

            if (isNaN(fromIndex) || isNaN(toIndex)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid indices provided'
                });
            }

            const course = await CourseService.reorderContent(
                courseId,
                parseInt(fromIndex),
                parseInt(toIndex),
                req.user._id
            );

            res.json({
                success: true,
                data: course,
                message: 'Content reordered successfully'
            });
        } catch (error) {
            console.error('Reorder content error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to reorder content'
            });
        }
    }
}

module.exports = new CourseController(); 