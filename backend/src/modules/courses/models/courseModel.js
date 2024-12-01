const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required']
    },
    difficultyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sequence: [{
        contentType: {
            type: String,
            enum: ['video', 'quiz'],
            required: true
        },
        contentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'sequence.contentModel'
        },
        contentModel: {
            type: String,
            required: true,
            enum: ['Video', 'Quiz']
        },
        order: {
            type: Number,
            required: true
        },
        title: String,
        duration: String
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    totalDuration: String
}, {
    timestamps: true
});

// Ensure unique titles per instructor
courseSchema.index({ title: 1, instructor: 1 }, { unique: true });

// Pre-save middleware to update cached fields
courseSchema.pre('save', async function(next) {
    if (this.isModified('sequence')) {
        // Update cached titles and durations
        for (const item of this.sequence) {
            const Model = mongoose.model(item.contentModel);
            const content = await Model.findById(item.contentId);
            if (content) {
                item.title = content.title;
                if (item.contentType === 'video') {
                    item.duration = content.duration;
                }
            }
        }

        // Calculate total duration
        const totalMinutes = this.sequence
            .filter(item => item.contentType === 'video' && item.duration)
            .reduce((total, item) => {
                const [mins = 0] = item.duration.split(':').map(Number);
                return total + mins;
            }, 0);

        this.totalDuration = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
    }
    next();
});

module.exports = mongoose.model('Course', courseSchema); 