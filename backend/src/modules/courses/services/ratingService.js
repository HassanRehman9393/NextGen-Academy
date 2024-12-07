const Rating = require('../models/ratingModel');
const Course = require('../models/courseModel');
const Enrollment = require('../models/enrollmentModel');

class RatingService {
    async addRating(studentId, courseId, ratingData) {
        try {
            console.log('Adding rating in service:', { studentId, courseId, ratingData });

            // Check if student has already rated
            const existingRating = await Rating.findOne({
                student: studentId,
                course: courseId
            });

            if (existingRating) {
                // Update existing rating
                console.log('Updating existing rating');
                existingRating.rating = ratingData.rating;
                existingRating.feedback = ratingData.feedback;
                existingRating.updatedAt = Date.now();
                const updatedRating = await existingRating.save();
                console.log('Rating updated:', updatedRating);
                return updatedRating;
            }

            // Create new rating
            console.log('Creating new rating');
            const rating = new Rating({
                student: studentId,
                course: courseId,
                rating: ratingData.rating,
                feedback: ratingData.feedback
            });

            const savedRating = await rating.save();
            console.log('New rating saved:', savedRating);
            return savedRating;
        } catch (error) {
            console.error('Error in addRating service:', error);
            throw error;
        }
    }

    async getCourseRatings(courseId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const [ratings, total] = await Promise.all([
                Rating.find({ course: courseId })
                    .populate('student', 'firstName lastName')
                    .sort('-createdAt')
                    .skip(skip)
                    .limit(limit),
                Rating.countDocuments({ course: courseId })
            ]);

            return {
                ratings,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalRatings: total
                }
            };
        } catch (error) {
            console.error('Error in getCourseRatings:', error);
            throw error;
        }
    }

    async getStudentRating(studentId, courseId) {
        try {
            return await Rating.findOne({
                student: studentId,
                course: courseId
            });
        } catch (error) {
            console.error('Error in getStudentRating:', error);
            throw error;
        }
    }

    async updateRating(ratingId, studentId, updateData) {
        try {
            const rating = await Rating.findOne({
                _id: ratingId,
                student: studentId
            });

            if (!rating) {
                throw new Error('Rating not found or unauthorized');
            }

            rating.rating = updateData.rating;
            rating.feedback = updateData.feedback;
            rating.updatedAt = Date.now();

            return await rating.save();
        } catch (error) {
            console.error('Error in updateRating:', error);
            throw error;
        }
    }

    async deleteRating(ratingId, studentId) {
        try {
            const rating = await Rating.findOneAndDelete({
                _id: ratingId,
                student: studentId
            });

            if (!rating) {
                throw new Error('Rating not found or unauthorized');
            }

            return rating;
        } catch (error) {
            console.error('Error in deleteRating:', error);
            throw error;
        }
    }
}

module.exports = new RatingService(); 