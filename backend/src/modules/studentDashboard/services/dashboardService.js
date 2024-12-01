const Course = require('../../courses/models/courseModel');
const Video = require('../../videos/models/videoModel');
const { buildSortOptions } = require('../utils/searchUtils');
const mongoose = require('mongoose');

class DashboardService {
    async getCourses({ query, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' }) {
        try {
            console.log('MongoDB Connection State:', mongoose.connection.readyState);
            console.log('Course Model:', Course.modelName, Course.collection.name);
            
            const totalCoursesInDB = await Course.countDocuments();
            console.log('Total courses in database:', totalCoursesInDB);

            const skip = (page - 1) * limit;
            const sortOptions = buildSortOptions(sortBy, sortOrder);

            const [courses, totalItems] = await Promise.all([
                Course.find()
                    .populate({
                        path: 'instructor',
                        select: 'firstName lastName email'
                    })
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec(),
                Course.countDocuments()
            ]);

            console.log('Final courses query result:', {
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
            console.error('Detailed error in getCourses service:', {
                error: error.message,
                stack: error.stack,
                name: error.name
            });
            throw new Error(`Failed to fetch courses: ${error.message}`);
        }
    }

    async getVideos({ query, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' }) {
        try {
            console.log('MongoDB Connection State:', mongoose.connection.readyState);
            console.log('Video Model:', Video.modelName, Video.collection.name);
            
            const totalVideosInDB = await Video.countDocuments();
            console.log('Total videos in database:', totalVideosInDB);

            const skip = (page - 1) * limit;
            const sortOptions = buildSortOptions(sortBy, sortOrder);

            const [videos, totalItems] = await Promise.all([
                Video.find()
                    .populate({
                        path: 'uploadedBy',
                        select: 'firstName lastName email'
                    })
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .lean()
                    .exec(),
                Video.countDocuments()
            ]);

            console.log('Final videos query result:', {
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
            console.error('Detailed error in getVideos service:', {
                error: error.message,
                stack: error.stack,
                name: error.name
            });
            throw new Error(`Failed to fetch videos: ${error.message}`);
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

    async isUserEnrolled(userId, courseId) {
        try {
            const enrollment = await Course.findOne({
                _id: courseId,
                'enrollments.userId': userId
            });
            return !!enrollment;
        } catch (error) {
            console.error('Error checking enrollment:', error);
            return false;
        }
    }

    async enrollUserInCourse(userId, courseId) {
        try {
            const course = await Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            if (await this.isUserEnrolled(userId, courseId)) {
                throw new Error('Already enrolled in this course');
            }

            course.enrollments.push({
                userId,
                enrolledAt: new Date(),
                progress: 0
            });

            await course.save();
        } catch (error) {
            console.error('Error enrolling user:', error);
            throw error;
        }
    }

    async getVideoProgress(userId, videoId) {
        try {
            const progress = await Video.findOne(
                { _id: videoId, 'progress.userId': userId },
                { 'progress.$': 1 }
            );
            return progress?.progress[0]?.percent || 0;
        } catch (error) {
            console.error('Error getting video progress:', error);
            return 0;
        }
    }

    async updateVideoProgress(userId, videoId, progress) {
        try {
            await Video.findOneAndUpdate(
                { _id: videoId, 'progress.userId': userId },
                { $set: { 'progress.$.percent': progress } },
                { upsert: true }
            );
        } catch (error) {
            console.error('Error updating video progress:', error);
            throw error;
        }
    }

    async markVideoComplete(userId, videoId) {
        try {
            await Video.findOneAndUpdate(
                { _id: videoId, 'progress.userId': userId },
                {
                    $set: {
                        'progress.$.percent': 100,
                        'progress.$.completedAt': new Date()
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            console.error('Error marking video complete:', error);
            throw error;
        }
    }
}

module.exports = new DashboardService(); 