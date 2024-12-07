const ratingService = require('../services/ratingService');
const Enrollment = require('../models/enrollmentModel');

class RatingController {
    async addRating(req, res) {
        try {
            console.log('Adding rating - Request details:', {
                userId: req.user._id,
                roles: req.user.roles,
                courseId: req.params.courseId,
                body: req.body
            });

            const { courseId } = req.params;
            const { rating, feedback } = req.body;

            if (!rating || !feedback) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating and feedback are required'
                });
            }

            // Check enrollment
            const enrollment = await Enrollment.findOne({
                student: req.user._id,
                course: courseId
            });

            if (!enrollment) {
                return res.status(403).json({
                    success: false,
                    message: 'You must be enrolled in the course to rate it'
                });
            }

            const ratingData = await ratingService.addRating(
                req.user._id,
                courseId,
                { rating, feedback }
            );

            console.log('Rating added successfully:', ratingData);

            res.status(201).json({
                success: true,
                data: ratingData
            });
        } catch (error) {
            console.error('Error in addRating controller:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to add rating'
            });
        }
    }

    async getCourseRatings(req, res) {
        try {
            const { courseId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const data = await ratingService.getCourseRatings(
                courseId,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getStudentRating(req, res) {
        try {
            const { courseId } = req.params;

            const rating = await ratingService.getStudentRating(
                req.user._id,
                courseId
            );

            res.json({
                success: true,
                data: rating
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateRating(req, res) {
        try {
            const { ratingId } = req.params;
            const { rating, feedback } = req.body;

            if (!rating || !feedback) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating and feedback are required'
                });
            }

            const updatedRating = await ratingService.updateRating(
                ratingId,
                req.user._id,
                { rating, feedback }
            );

            res.json({
                success: true,
                data: updatedRating
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteRating(req, res) {
        try {
            const { ratingId } = req.params;

            await ratingService.deleteRating(ratingId, req.user._id);

            res.json({
                success: true,
                message: 'Rating deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new RatingController(); 