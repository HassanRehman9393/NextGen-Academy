const CourseService = require('../services/courseService');
const { validateCourse } = require('../utils/validation');
const SequenceUtils = require('../utils/sequenceUtils');
const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const Enrollment = require('../../courses/models/enrollmentModel');
const Rating = require('../../courses/models/ratingModel');

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
            const { id } = req.params;
            
            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid course ID format'
                });
            }

            const course = await Course.findById(id)
                .populate('instructor', 'firstName lastName');

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
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch course'
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

    async getInstructorCourses(req, res) {
        try {
            console.log('Getting courses for instructor:', req.user._id);
            
            const courses = await Course.find({ instructor: req.user._id })
                .populate('instructor', 'firstName lastName')
                .sort('-createdAt');

            console.log('Found courses:', courses.length);

            // Get enrollment counts and ratings for each course
            const coursesWithStats = await Promise.all(courses.map(async (course) => {
                try {
                    const [enrollmentCount, ratings] = await Promise.all([
                        Enrollment.countDocuments({ course: course._id }),
                        Rating.find({ course: course._id })
                    ]);

                    const averageRating = ratings.length > 0 
                        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
                        : 0;

                    return {
                        ...course.toObject(),
                        enrollmentCount,
                        averageRating: parseFloat(averageRating.toFixed(1))
                    };
                } catch (err) {
                    console.error(`Error processing course ${course._id}:`, err);
                    return {
                        ...course.toObject(),
                        enrollmentCount: 0,
                        averageRating: 0
                    };
                }
            }));

            res.json({
                success: true,
                data: coursesWithStats
            });
        } catch (error) {
            console.error('Error in getInstructorCourses:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch instructor courses'
            });
        }
    }
}

module.exports = new CourseController(); 