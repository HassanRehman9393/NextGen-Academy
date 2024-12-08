const mongoose = require('mongoose');

const instructorResponseSchema = new mongoose.Schema({
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    response: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InstructorResponse', instructorResponseSchema); 