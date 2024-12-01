const DashboardService = require('../services/dashboardService');
const { getPaginationMetadata } = require('../utils/paginationHelper');

class DashboardController {
    async getCourses(req, res) {
        try {
            console.log('Getting courses with query:', req.query);
            const {
                page = 1,
                limit = 12,
                search,
                category,
                difficultyLevel,
                sortBy,
                sortOrder,
                minRating
            } = req.query;

            // Build query object
            const query = { isPublished: true };
            
            // Add text search if provided
            if (search) {
                query.$text = { $search: search };
            }
            
            // Add filters if provided
            if (category) query.category = category;
            if (difficultyLevel) query.difficultyLevel = difficultyLevel;
            if (minRating) query.rating = { $gte: parseFloat(minRating) };

            console.log('Final query:', query);

            const result = await DashboardService.getCourses({
                query,
                page: parseInt(page),
                limit: parseInt(limit),
                sortBy,
                sortOrder
            });

            console.log('Query result:', result);

            const paginationMetadata = getPaginationMetadata(
                result.totalItems,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                data: result.courses,
                pagination: paginationMetadata
            });
        } catch (error) {
            console.error('Error in getCourses controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch courses'
            });
        }
    }

    async getVideos(req, res) {
        try {
            console.log('Getting videos with query:', req.query);
            const {
                page = 1,
                limit = 12,
                search,
                category,
                sortBy,
                sortOrder
            } = req.query;

            // Build query object
            const query = { isPublished: true };
            
            // Add text search if provided
            if (search) {
                query.$text = { $search: search };
            }
            
            // Add filters if provided
            if (category) query.category = category;

            console.log('Final video query:', query);

            const result = await DashboardService.getVideos({
                query,
                page: parseInt(page),
                limit: parseInt(limit),
                sortBy,
                sortOrder
            });

            console.log('Video query result:', result);

            const paginationMetadata = getPaginationMetadata(
                result.totalItems,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                data: result.videos,
                pagination: paginationMetadata
            });
        } catch (error) {
            console.error('Error in getVideos controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch videos'
            });
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await DashboardService.getCourseById(req.params.id);
            
            // Check if user is enrolled
            const isEnrolled = await DashboardService.isUserEnrolled(req.user._id, req.params.id);
            
            res.json({
                success: true,
                data: {
                    ...course.toObject(),
                    isEnrolled
                }
            });
        } catch (error) {
            console.error('Error in getCourseById controller:', error);
            const status = error.message === 'Course not found' ? 404 : 500;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    async getVideoById(req, res) {
        try {
            const video = await DashboardService.getVideoById(req.params.id);
            
            // Get user's progress
            const progress = await DashboardService.getVideoProgress(req.user._id, req.params.id);
            
            res.json({
                success: true,
                data: {
                    ...video.toObject(),
                    progress
                }
            });
        } catch (error) {
            console.error('Error in getVideoById controller:', error);
            const status = error.message === 'Video not found' ? 404 : 500;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    async enrollInCourse(req, res) {
        try {
            await DashboardService.enrollUserInCourse(req.user._id, req.params.courseId);
            res.json({
                success: true,
                message: 'Successfully enrolled in course'
            });
        } catch (error) {
            console.error('Error in enrollInCourse controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to enroll in course'
            });
        }
    }

    async updateVideoProgress(req, res) {
        try {
            const { progress } = req.body;
            await DashboardService.updateVideoProgress(
                req.user._id,
                req.params.videoId,
                progress
            );
            res.json({
                success: true,
                message: 'Progress updated successfully'
            });
        } catch (error) {
            console.error('Error in updateVideoProgress controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update progress'
            });
        }
    }

    async markVideoComplete(req, res) {
        try {
            await DashboardService.markVideoComplete(req.user._id, req.params.videoId);
            res.json({
                success: true,
                message: 'Video marked as complete'
            });
        } catch (error) {
            console.error('Error in markVideoComplete controller:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to mark video as complete'
            });
        }
    }
}

module.exports = new DashboardController(); 