const ratingManagementService = require('../services/ratingManagementService');

class RatingManagementController {
    async getCourseRatings(req, res) {
        try {
            const { courseId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const data = await ratingManagementService.getCourseRatings(
                courseId,
                req.user._id,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('Error in getCourseRatings controller:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async respondToRating(req, res) {
        try {
            const { ratingId } = req.params;
            const { response } = req.body;
            const instructorId = req.user._id;

            console.log('Responding to rating:', {
                ratingId,
                instructorId,
                responseLength: response?.length
            });

            if (!response?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Response content is required'
                });
            }

            const data = await ratingManagementService.respondToRating(
                ratingId,
                instructorId,
                response
            );

            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('Error in respondToRating controller:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteResponse(req, res) {
        try {
            const { responseId } = req.params;

            await ratingManagementService.deleteResponse(responseId, req.user._id);

            res.json({
                success: true,
                message: 'Response deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteResponse controller:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getRatingAnalytics(req, res) {
        try {
            const { courseId } = req.params;

            const data = await ratingManagementService.getRatingAnalytics(
                courseId,
                req.user._id
            );

            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('Error in getRatingAnalytics controller:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new RatingManagementController(); 