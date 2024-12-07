const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    messages: [messageSchema],
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Update lastMessageAt when new messages are added
chatSchema.pre('save', function(next) {
    if (this.messages && this.messages.length > 0) {
        this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
    }
    next();
});

module.exports = mongoose.model('Chat', chatSchema); 