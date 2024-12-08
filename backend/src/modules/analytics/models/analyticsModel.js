const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    completionCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    discussionStats: {
        totalThreads: { type: Number, default: 0 },
        totalComments: { type: Number, default: 0 },
        activeParticipants: { type: Number, default: 0 }
    },
    quizStats: {
        totalAttempts: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        passRate: { type: Number, default: 0 }
    },
    weeklyEngagement: [{
        week: Date,
        activeUsers: Number,
        newEnrollments: Number,
        completions: Number
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema); 