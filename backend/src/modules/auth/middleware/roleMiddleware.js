const requireInstructor = (req, res, next) => {
    try {
        console.log('Checking instructor role. User:', req.user);
        console.log('User roles:', req.user.roles);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Convert roles to array if it's not already
        const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
        
        if (!userRoles.includes('instructor')) {
            console.log('Access denied: User roles do not include instructor');
            return res.status(403).json({
                success: false,
                message: 'Instructor access required'
            });
        }

        console.log('Instructor role verified');
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
        console.log('Checking student role. User:', req.user);
        console.log('User roles:', req.user.roles);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Convert roles to array if it's not already
        const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
        
        if (!userRoles.includes('student')) {
            console.log('Access denied: User roles do not include student');
            return res.status(403).json({
                success: false,
                message: 'Student access required'
            });
        }

        console.log('Student role verified');
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