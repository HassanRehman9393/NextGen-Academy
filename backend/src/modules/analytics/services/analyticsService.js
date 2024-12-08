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
            if (Date.now() - analytics.lastUpdated > 3600000) {
                analytics = await this.updateAnalytics(courseId, analytics);
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
                weeklyEngagement: await this.calculateWeeklyEngagement(courseId)
            });

            return await analytics.save();
        } catch (error) {
            console.error('Error generating analytics:', error);
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
                [f.authorId, ...f.comments.map(c => c.authorId)]
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