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

// Ensure one rating per student per course
ratingSchema.index({ student: 1, course: 1 }, { unique: true });

// Update course average rating when a rating is added or modified
ratingSchema.post('save', async function() {
    const Course = mongoose.model('Course');
    const ratings = await this.constructor.find({ course: this.course });
    
    const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
    
    await Course.findByIdAndUpdate(this.course, {
        $set: {
            rating: Math.round(averageRating * 10) / 10,
            totalRatings: ratings.length
        }
    });
});

module.exports = mongoose.model('Rating', ratingSchema); 