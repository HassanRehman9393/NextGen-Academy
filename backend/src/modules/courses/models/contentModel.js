const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    contentType: {
        type: String,
        enum: ['video', 'quiz'],
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'contentModel'
    },
    contentModel: {
        type: String,
        required: true,
        enum: ['Video', 'Quiz']
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    duration: String,
    metadata: {
        thumbnailUrl: String,
        questionCount: Number, // For quizzes
        videoLength: String,   // For videos
        format: String,        // For videos
        size: Number,         // For videos (in bytes)
        lastAccessed: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
contentSchema.index({ contentType: 1, contentId: 1 }, { unique: true });
contentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Content', contentSchema); 