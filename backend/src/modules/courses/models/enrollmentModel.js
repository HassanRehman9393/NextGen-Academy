const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'contentModel'
    },
    contentModel: {
        type: String,
        enum: ['Video', 'Quiz']
    },
    completed: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    }
});

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    contentProgress: [progressSchema],
    isCompleted: {
        type: Boolean,
        default: false
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for quick lookups
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema); 