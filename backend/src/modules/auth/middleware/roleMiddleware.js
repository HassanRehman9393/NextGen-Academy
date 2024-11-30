const requireInstructor = (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes('instructor')) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Instructor privileges required.'
        });
    }
    next();
};

module.exports = { requireInstructor }; 