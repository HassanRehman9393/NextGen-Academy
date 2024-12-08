const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    instructorResponse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InstructorResponse'
    }
}, {
    timestamps: true
});

// Ensure one rating per student per course
ratingSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema); 