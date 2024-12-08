const Analytics = require('../models/analyticsModel');
const Course = require('../../courses/models/courseModel');
const Enrollment = require('../../courses/models/enrollmentModel');
const Rating = require('../../courses/models/ratingModel');
const Forum = require('../../discussion/models/forumModel');
const Quiz = require('../../quizzes/models/quizModel');

class AnalyticsService {
    async getCourseAnalytics(courseId) {
        try {
            let analytics = await Analytics.findOne({ courseId });
            
            if (!analytics) {
                analytics = await this.generateAnalytics(courseId);
            }

            // Check if analytics need updating (older than 1 hour)
            const oneHourAgo = new Date(Date.now() - 3600000);
            if (analytics.lastUpdated < oneHourAgo) {
                analytics = await this.generateAnalytics(courseId);
            }

            return analytics;
        } catch (error) {
            console.error('Error in getCourseAnalytics:', error);
            throw error;
        }
    }

    async generateAnalytics(courseId) {
        try {
            const [
                enrollments,
                ratings,
                forums,
                quizzes
            ] = await Promise.all([
                Enrollment.find({ course: courseId }),
                Rating.find({ course: courseId }),
                Forum.find({ courseId }),
                Quiz.find({ courseId })
            ]);

            const analytics = new Analytics({
                courseId,
                enrollmentCount: enrollments.length,
                completionCount: enrollments.filter(e => e.isCompleted).length,
                averageRating: this.calculateAverageRating(ratings),
                totalRatings: ratings.length,
                discussionStats: this.calculateDiscussionStats(forums),
                quizStats: await this.calculateQuizStats(quizzes),
                weeklyEngagement: await this.calculateWeeklyEngagement(courseId),
                lastUpdated: new Date()
            });

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error generating analytics:', error);
            throw error;
        }
    }

    async updateAnalytics(courseId, analyticsData) {
        try {
            const analytics = await Analytics.findOneAndUpdate(
                { courseId },
                { 
                    ...analyticsData,
                    lastUpdated: new Date()
                },
                { new: true, upsert: true }
            );
            return analytics;
        } catch (error) {
            console.error('Error updating analytics:', error);
            throw error;
        }
    }

    // Helper methods
    calculateAverageRating(ratings) {
        if (!ratings.length) return 0;
        return ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    }

    calculateDiscussionStats(forums) {
        return {
            totalThreads: forums.length,
            totalComments: forums.reduce((acc, forum) => acc + forum.comments.length, 0),
            activeParticipants: new Set(forums.flatMap(f => 
                [f.instructorId, ...f.comments.map(c => c.studentId)]
            )).size
        };
    }

    async calculateQuizStats(quizzes) {
        // Implementation for quiz statistics
        return {
            totalAttempts: 0,
            averageScore: 0,
            passRate: 0
        };
    }

    async calculateWeeklyEngagement(courseId) {
        // Implementation for weekly engagement
        return [];
    }
}

module.exports = new AnalyticsService(); 