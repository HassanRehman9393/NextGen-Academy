const requireInstructor = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!req.user.roles.includes('instructor')) {
            return res.status(403).json({
                success: false,
                message: 'Instructor access required'
            });
        }

        next();
    } catch (error) {
        console.error('Role middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const requireStudent = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!req.user.roles.includes('student')) {
            return res.status(403).json({
                success: false,
                message: 'Student access required'
            });
        }

        next();
    } catch (error) {
        console.error('Role middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    requireInstructor,
    requireStudent
}; 