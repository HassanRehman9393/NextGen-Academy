const forumService = require('../services/studentForumService');
const { handleError } = require('../utils/errorHandler');

class StudentForumController {
    async getAllForums(req, res) {
        try {
            const { page = 1, limit = 10, courseId } = req.query;
            const forums = await forumService.getAllForums(
                parseInt(page),
                parseInt(limit),
                courseId
            );

            res.status(200).json({
                success: true,
                data: forums
            });
        } catch (error) {
            handleError(error, req, res);
        }
    }

    async getForumDetails(req, res) {
        try {
            const { forumId } = req.params;
            const forum = await forumService.getForumDetails(forumId);
            
            res.status(200).json({
                success: true,
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
            const studentId = req.user._id;

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Comment content is required'
                });
            }

            const comment = await forumService.addComment(forumId, {
                content,
                studentId
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

    async getForumsByCourse(req, res) {
        try {
            const { courseId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            
            const forums = await forumService.getForumsByCourse(
                courseId,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                data: forums
            });
        } catch (error) {
            handleError(error, req, res);
        }
    }
}

module.exports = new StudentForumController(); 