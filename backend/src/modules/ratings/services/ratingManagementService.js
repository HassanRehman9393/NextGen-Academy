const Rating = require('../../courses/models/ratingModel');
const InstructorResponse = require('../models/instructorResponseModel');
const Course = require('../../courses/models/courseModel');

class RatingManagementService {
    async getCourseRatings(courseId, instructorId, page = 1, limit = 10) {
        try {
            // Verify instructor owns the course
            const course = await Course.findOne({ 
                _id: courseId, 
                instructor: instructorId 
            });

            if (!course) {
                throw new Error('Course not found or unauthorized');
            }

            const skip = (page - 1) * limit;

            const [ratings, total] = await Promise.all([
                Rating.find({ course: courseId })
                    .populate('student', 'firstName lastName email')
                    .populate({
                        path: 'instructorResponse',
                        model: 'InstructorResponse',
                        select: 'response createdAt updatedAt'
                    })
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

    async respondToRating(ratingId, instructorId, response) {
        try {
            // First, find the rating
            const rating = await Rating.findById(ratingId);
            if (!rating) {
                throw new Error('Rating not found');
            }

            // Find the course and verify instructor ownership
            const course = await Course.findOne({
                _id: rating.course,
                instructor: instructorId
            });

            if (!course) {
                throw new Error('Unauthorized to respond to this rating');
            }

            // Create or update instructor response
            const instructorResponse = await InstructorResponse.findOneAndUpdate(
                { rating: ratingId },
                {
                    rating: ratingId,
                    instructor: instructorId,
                    response: response,
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );

            // Update rating with response reference
            rating.instructorResponse = instructorResponse._id;
            await rating.save();

            return instructorResponse;
        } catch (error) {
            console.error('Error in respondToRating:', error);
            throw error;
        }
    }

    async deleteResponse(responseId, instructorId) {
        try {
            const response = await InstructorResponse.findById(responseId)
                .populate({
                    path: 'rating',
                    populate: { path: 'course' }
                });

            if (!response) {
                throw new Error('Response not found');
            }

            if (response.rating.course.instructor.toString() !== instructorId) {
                throw new Error('Unauthorized to delete this response');
            }

            // Remove response reference from rating
            await Rating.findByIdAndUpdate(response.rating._id, {
                $unset: { instructorResponse: 1 }
            });

            // Delete the response
            await InstructorResponse.findByIdAndDelete(responseId);

            return { success: true };
        } catch (error) {
            console.error('Error in deleteResponse:', error);
            throw error;
        }
    }

    async getRatingAnalytics(courseId, instructorId) {
        try {
            // Verify instructor owns the course
            const course = await Course.findOne({ 
                _id: courseId, 
                instructor: instructorId 
            });

            if (!course) {
                throw new Error('Course not found or unauthorized');
            }

            const ratings = await Rating.find({ course: courseId });

            const analytics = {
                totalRatings: ratings.length,
                averageRating: 0,
                ratingDistribution: {
                    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
                },
                responseRate: 0
            };

            if (ratings.length > 0) {
                // Calculate average rating
                const totalStars = ratings.reduce((acc, curr) => acc + curr.rating, 0);
                analytics.averageRating = totalStars / ratings.length;

                // Calculate rating distribution
                ratings.forEach(rating => {
                    analytics.ratingDistribution[rating.rating]++;
                });

                // Calculate response rate
                const responsesCount = ratings.filter(r => r.instructorResponse).length;
                analytics.responseRate = (responsesCount / ratings.length) * 100;
            }

            return analytics;
        } catch (error) {
            console.error('Error in getRatingAnalytics:', error);
            throw error;
        }
    }
}

module.exports = new RatingManagementService(); 