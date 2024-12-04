const Course = require('../../courses/models/courseModel');
const Video = require('../../videos/models/videoModel');
const { buildSearchQuery, buildSortOptions } = require('../utils/searchUtils');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');

class DashboardController {
    // Get all courses without search
    async getAllCourses(req, res) {
        try {
            const { page = 1, limit = 10, category, difficultyLevel } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            console.log('Fetching all courses with filters:', { category, difficultyLevel });

            const query = {};
            if (category) {
                query.category = category;
            }
            if (difficultyLevel) {
                query.difficultyLevel = difficultyLevel;
            }

            // Apply filters to the query
            const courses = await Course.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(validLimit)
                .populate('instructor', 'firstName lastName');

            console.log('Found courses:', courses);

            const totalItems = await Course.countDocuments(query);

            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: courses,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error getting courses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get courses'
            });
        }
    }

    // Search courses
    async searchCourses(req, res) {
        try {
            const { search, page = 1, limit = 10, ...filters } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            const query = {
                title: { $regex: search, $options: 'i' }
            };

            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.difficultyLevel) {
                query.difficultyLevel = filters.difficultyLevel;
            }

            console.log('Search query:', query);

            const courses = await Course.find(query)
                .sort(buildSortOptions(filters.sortBy, filters.sortOrder))
                .skip(skip)
                .limit(validLimit)
                .populate('instructor', 'firstName lastName');

            const totalItems = await Course.countDocuments(query);
            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: courses,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error searching courses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search courses'
            });
        }
    }

    // Get all videos without search
    async getAllVideos(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            console.log('Fetching all videos...');

            // Remove isPublished filter temporarily for testing
            const videos = await Video.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(validLimit)
                .populate('uploadedBy', 'firstName lastName');

            console.log('Found videos:', videos);

            const totalItems = await Video.countDocuments();
            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: videos,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error getting videos:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get videos'
            });
        }
    }

    // Search videos
    async searchVideos(req, res) {
        try {
            const { search, page = 1, limit = 10, ...filters } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            const query = {
                title: { $regex: search, $options: 'i' }
            };

            if (filters.category) {
                query.category = filters.category;
            }

            console.log('Search query:', query);

            const videos = await Video.find(query)
                .sort(buildSortOptions(filters.sortBy, filters.sortOrder))
                .skip(skip)
                .limit(validLimit)
                .populate('uploadedBy', 'firstName lastName');

            const totalItems = await Video.countDocuments(query);
            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: videos,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error searching videos:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search videos'
            });
        }
    }

    // Get course by ID
    async getCourseById(req, res) {
        try {
            const course = await Course.findById(req.params.id)
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
            console.error('Error getting course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get course'
            });
        }
    }

    // Get video by ID
    async getVideoById(req, res) {
        try {
            const video = await Video.findById(req.params.id)
                .populate('uploadedBy', 'firstName lastName');

            if (!video) {
                return res.status(404).json({
                    success: false,
                    message: 'Video not found'
                });
            }

            res.json({
                success: true,
                data: video
            });
        } catch (error) {
            console.error('Error getting video:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get video'
            });
        }
    }
}

module.exports = new DashboardController(); 