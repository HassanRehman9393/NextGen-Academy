const jwt = require('jsonwebtoken');
const User = require('../../auth/models/userModel');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log the decoded token and user ID
        console.log('Decoded token:', decoded);
        
        // Fetch complete user data from database
        const user = await User.findById(decoded.userId || decoded._id);
        console.log('Found user:', user);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Set complete user object in request
        req.user = user.toObject(); // Convert to plain object
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { authenticateToken }; 