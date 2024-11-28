const requireInstructor = (req, res, next) => {
    // Check if user exists
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    // Check if roles array exists
    if (!Array.isArray(req.user.roles)) {
        return res.status(403).json({
            success: false,
            message: 'User roles not properly configured'
        });
    }

    // Check if user has instructor role
    if (!req.user.roles.includes('instructor')) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Instructor role required.'
        });
    }

    next();
};

module.exports = { requireInstructor }; 