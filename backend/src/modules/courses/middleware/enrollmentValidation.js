const mongoose = require('mongoose');

const validateEnrollmentRequest = (req, res, next) => {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid course ID'
        });
    }

    next();
};

const validateProgressUpdate = (req, res, next) => {
    const { progress, completed } = req.body;
    const { courseId, contentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid course or content ID'
        });
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({
            success: false,
            message: 'Progress must be a number between 0 and 100'
        });
    }

    if (typeof completed !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'Completed status must be a boolean'
        });
    }

    next();
};

module.exports = {
    validateEnrollmentRequest,
    validateProgressUpdate
}; 