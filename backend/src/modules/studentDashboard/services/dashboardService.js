const Course = require('../../courses/models/courseModel');
const Video = require('../../videos/models/videoModel');
const { buildSortOptions } = require('../utils/searchUtils');
const mongoose = require('mongoose');

class DashboardService {
    async getCourses({ query, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' }) {
        try {
            console.log('Getting courses with query:', query);
            
            // Build search query
            const searchQuery = {};
            
            // Add text search if provided
            if (query.search) {
                searchQuery.$or = [
                    { title: { $regex: query.search, $options: 'i' } },
                    { description: { $regex: query.search, $options: 'i' } }
                ];
            }

            // Add filters
            if (query.category) {
                searchQuery.category = query.category;
            }
            if (query.difficultyLevel) {
                searchQuery.difficultyLevel = query.difficultyLevel;
            }
            if (query.minRating) {
                searchQuery.rating = { $gte: parseFloat(query.minRating) };
            }

            console.log('Final search query:', searchQuery);

            const skip = (page - 1) * limit;
            const sortOptions = buildSortOptions(sortBy, sortOrder);

            const [courses, totalItems] = await Promise.all([
                Course.find(searchQuery)
                    .populate({
                        path: 'instructor',
                        select: 'firstName lastName email'
                    })
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec(),
                Course.countDocuments(searchQuery)
            ]);

            console.log('Query results:', {
                coursesFound: courses.length,
                totalItems,
                skip,
                limit,
                sortOptions
            });

            return {
                courses,
                totalItems
            };
        } catch (error) {
            console.error('Error in getCourses service:', error);
            throw error;
        }
    }

    async getVideos({ query, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' }) {
        try {
            console.log('Getting videos with query:', query);
            
            // Build search query
            const searchQuery = {};
            
            // Add text search if provided
            if (query.search) {
                searchQuery.$or = [
                    { title: { $regex: query.search, $options: 'i' } },
                    { description: { $regex: query.search, $options: 'i' } }
                ];
            }

            // Add filters
            if (query.category) {
                searchQuery.category = query.category;
            }
            if (query.duration) {
                switch (query.duration) {
                    case 'short':
                        searchQuery.duration = { $lte: 300 }; // 5 minutes
                        break;
                    case 'medium':
                        searchQuery.duration = { $gt: 300, $lte: 1200 }; // 5-20 minutes
                        break;
                    case 'long':
                        searchQuery.duration = { $gt: 1200 }; // > 20 minutes
                        break;
                }
            }

            console.log('Final video search query:', searchQuery);

            const skip = (page - 1) * limit;
            const sortOptions = buildSortOptions(sortBy, sortOrder);

            const [videos, totalItems] = await Promise.all([
                Video.find(searchQuery)
                    .populate({
                        path: 'uploadedBy',
                        select: 'firstName lastName email'
                    })
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec(),
                Video.countDocuments(searchQuery)
            ]);

            console.log('Query results:', {
                videosFound: videos.length,
                totalItems,
                skip,
                limit,
                sortOptions
            });

            return {
                videos,
                totalItems
            };
        } catch (error) {
            console.error('Error in getVideos service:', error);
            throw error;
        }
    }

    async getCourseById(courseId) {
        try {
            const course = await Course.findById(courseId)
                .populate('instructor', 'firstName lastName email')
                .populate({
                    path: 'sequence.contentId',
                    select: 'title duration description thumbnail'
                });

            if (!course) {
                throw new Error('Course not found');
            }

            return course;
        } catch (error) {
            console.error('Error in getCourseById service:', error);
            throw error;
        }
    }

    async getVideoById(videoId) {
        try {
            const video = await Video.findById(videoId)
                .populate('uploadedBy', 'firstName lastName email');

            if (!video) {
                throw new Error('Video not found');
            }

            return video;
        } catch (error) {
            console.error('Error in getVideoById service:', error);
            throw error;
        }
    }
}

module.exports = new DashboardService(); 