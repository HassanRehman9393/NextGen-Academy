const Forum = require('../models/forumModel');
const { ForumError } = require('../utils/errorHandler');
const { config, validators } = require('../config/discussionConfig');
const { formatForumsList, formatForumDetails } = require('../utils/responseFormatter');

class ForumService {
    async createForum(forumData) {
        try {
            if (!validators.isValidForumTitle(forumData.title)) {
                throw new ForumError('Invalid forum title length', 400);
            }
            if (!validators.isValidForumDescription(forumData.description)) {
                throw new ForumError('Invalid forum description length', 400);
            }
            if (!validators.isValidForumTopic(forumData.topic)) {
                throw new ForumError('Invalid forum topic length', 400);
            }

            const forum = new Forum({
                title: forumData.title.trim(),
                topic: forumData.topic.trim(),
                description: forumData.description.trim(),
                instructorId: forumData.instructorId,
                courseId: forumData.courseId,
                comments: [],
                isActive: true
            });

            await forum.save();

            await forum.populate('instructorId', 'firstName lastName email');
            
            return forum;
        } catch (error) {
            console.error('Forum Service Error:', error);
            throw new ForumError('Error creating forum', 400, error.message);
        }
    }

    async getForumsByInstructor(instructorId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            
            const [forums, total] = await Promise.all([
                Forum.find({ instructorId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('instructorId', 'firstName lastName email'),
                Forum.countDocuments({ instructorId })
            ]);

            return {
                forums,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Forum Service Error:', error);
            throw new Error('Error fetching forums');
        }
    }

    async getForumDetails(forumId) {
        try {
            const forum = await Forum.findById(forumId)
                .populate('instructorId', 'firstName lastName email')
                .populate('comments.studentId', 'firstName lastName email')
                .populate('comments.replies.authorId', 'firstName lastName email');

            if (!forum) {
                throw new ForumError('Forum not found', 404);
            }

            return forum;
        } catch (error) {
            throw new ForumError('Error fetching forum details', 400, error.message);
        }
    }

    async addReply(forumId, commentId, replyData) {
        try {
            if (!validators.isValidReplyLength(replyData.content)) {
                throw new ForumError('Invalid reply length', 400);
            }

            const forum = await Forum.findById(forumId);
            if (!forum) {
                throw new ForumError('Forum not found', 404);
            }

            const comment = forum.comments.id(commentId);
            if (!comment) {
                throw new ForumError('Comment not found', 404);
            }

            if (comment.replies.length >= config.replies.maxPerComment) {
                throw new ForumError('Maximum replies limit reached for this comment', 400);
            }

            comment.replies.push(replyData);
            await forum.save();

            return formatForumDetails(forum);
        } catch (error) {
            throw new ForumError('Error adding reply', 400, error.message);
        }
    }

    async updateForum(forumId, updateData, instructorId) {
        try {
            const forum = await Forum.findOneAndUpdate(
                { _id: forumId, instructorId },
                updateData,
                { new: true }
            );

            if (!forum) {
                throw new ForumError('Forum not found or unauthorized', 404);
            }

            return forum;
        } catch (error) {
            throw new ForumError('Error updating forum', 400, error.message);
        }
    }

    async deleteForum(forumId, instructorId) {
        try {
            const forum = await Forum.findOneAndDelete({ 
                _id: forumId, 
                instructorId 
            });

            if (!forum) {
                throw new ForumError('Forum not found or unauthorized', 404);
            }

            return forum;
        } catch (error) {
            throw new ForumError('Error deleting forum', 400, error.message);
        }
    }
}

module.exports = new ForumService(); 