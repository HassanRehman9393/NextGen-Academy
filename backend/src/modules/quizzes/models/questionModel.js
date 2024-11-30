const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer'],
        required: true
    },
    options: [{
        text: String,
        isCorrect: Boolean
    }],
    points: {
        type: Number,
        default: 1
    },
    explanation: String,
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Add index for ordering
questionSchema.index({ quizId: 1, order: 1 });

module.exports = mongoose.model('Question', questionSchema); 