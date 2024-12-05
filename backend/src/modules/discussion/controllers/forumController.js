const forumService = require('../services/forumService');
const { handleError } = require('../utils/errorHandler');

class ForumController {
    async createForum(req, res) {
        try {
            const { title, topic, description, courseId } = req.body;
            
            // Validate required fields
            if (!title || !topic || !description || !courseId) {
                return res.status(400).json({
                    success: false,
                    message: 'Title, topic, description, and course selection are required'
                });
            }

            const forumData = {
                title: title.trim(),
                topic: topic.trim(),
                description: description.trim(),
                courseId,
                instructorId: req.user._id
            };

            const forum = await forumService.createForum(forumData);
            
            res.status(201).json({
                success: true,
                message: 'Forum created successfully',
                data: forum
            });
        } catch (error) {
            console.error('Forum Controller Error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error creating forum'
            });
        }
    }

    async getForumsByInstructor(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const instructorId = req.user._id;

            const forums = await forumService.getForumsByInstructor(
                instructorId,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                data: {
                    forums: forums.forums,
                    total: forums.total,
                    page: parseInt(page),
                    totalPages: Math.ceil(forums.total / limit)
                }
            });
        } catch (error) {
            console.error('Forum Controller Error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error fetching forums'
            });
        }
    }

    async getForumDetails(req, res) {
        try {
            const forum = await forumService.getForumDetails(req.params.forumId);
            res.status(200).json({
                success: true,
                data: forum
            });
        } catch (error) {
            handleError(error, req, res);
        }
    }

    async addReply(req, res) {
        try {
            const replyData = {
                content: req.body.content,
                authorId: req.user._id
            };
            const forum = await forumService.addReply(
                req.params.forumId,
                req.params.commentId,
                replyData
            );
            res.status(200).json({
                success: true,
                message: 'Reply added successfully',
                data: forum
            });
        } catch (error) {
            handleError(error, req, res);
        }
    }

    async updateForum(req, res) {
        try {
            const forum = await forumService.updateForum(
                req.params.forumId,
                req.body,
                req.user._id
            );
            res.status(200).json({
                success: true,
                message: 'Forum updated successfully',
                data: forum
            });
        } catch (error) {
            handleError(error, req, res);
        }
    }

    async deleteForum(req, res) {
        try {
            const forum = await forumService.deleteForum(req.params.forumId, req.user._id);
            res.status(200).json({
                success: true,
                message: 'Forum deleted successfully',
                data: forum
            });
        } catch (error) {
            handleError(error, req, res);
        }
    }

    async addComment(req, res) {
        try {
            const { forumId } = req.params;
            const { content } = req.body;
            const instructorId = req.user._id;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Comment content is required'
                });
            }

            const comment = await forumService.addComment(forumId, {
                content: content.trim(),
                studentId: instructorId
            });

            res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                data: comment
            });
        } catch (error) {
            handleError(error, req, res);
        }
    }
}

module.exports = new ForumController(); 