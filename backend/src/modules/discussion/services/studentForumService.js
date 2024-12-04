const Forum = require('../models/forumModel');
const { ForumError } = require('../utils/errorHandler');
const { sanitizeComment } = require('../utils/commentSanitizer');
const { config } = require('../config/paginationConfig');

class StudentForumService {
    async getAllForums(page = 1, limit = config.defaultLimit, courseId = null) {
        try {
            const query = { isActive: true };
            if (courseId) {
                query.courseId = courseId;
            }

            const skip = (page - 1) * limit;
            
            const [forums, total] = await Promise.all([
                Forum.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('instructorId', 'firstName lastName')
                    .populate('courseId', 'title'),
                Forum.countDocuments(query)
            ]);

            return {
                forums,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new ForumError('Error fetching forums', 400, error.message);
        }
    }

    async getForumDetails(forumId) {
        try {
            const forum = await Forum.findOne({ _id: forumId, isActive: true })
                .populate('instructorId', 'firstName lastName')
                .populate('comments.studentId', 'firstName lastName')
                .populate('comments.replies.authorId', 'firstName lastName');

            if (!forum) {
                throw new ForumError('Forum not found', 404);
            }

            return forum;
        } catch (error) {
            throw new ForumError('Error fetching forum details', 400, error.message);
        }
    }

    async addComment(forumId, commentData) {
        try {
            const forum = await Forum.findOne({ _id: forumId, isActive: true });
            if (!forum) {
                throw new ForumError('Forum not found', 404);
            }

            const sanitizedContent = sanitizeComment(commentData.content);
            
            forum.comments.push({
                content: sanitizedContent,
                studentId: commentData.studentId
            });

            await forum.save();
            
            return forum.comments[forum.comments.length - 1];
        } catch (error) {
            throw new ForumError('Error adding comment', 400, error.message);
        }
    }

    async getForumsByCourse(courseId, page = 1, limit = config.defaultLimit) {
        try {
            const skip = (page - 1) * limit;
            
            const [forums, total] = await Promise.all([
                Forum.find({ courseId, isActive: true })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('instructorId', 'firstName lastName')
                    .populate('courseId', 'title'),
                Forum.countDocuments({ courseId, isActive: true })
            ]);

            return {
                forums,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new ForumError('Error fetching course forums', 400, error.message);
        }
    }
}

module.exports = new StudentForumService(); 