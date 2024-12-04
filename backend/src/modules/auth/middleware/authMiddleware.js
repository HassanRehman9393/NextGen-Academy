const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        console.log('Auth Header:', authHeader);
        console.log('Received token:', token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);

            const user = await User.findById(decoded.userId);
            console.log('Found user:', user);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if token is about to expire (less than 1 day remaining)
            const tokenExp = decoded.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const oneDayInMs = 24 * 60 * 60 * 1000;

            if (tokenExp - now < oneDayInMs) {
                // Generate new token
                const newToken = jwt.sign(
                    { userId: user._id, roles: user.roles },
                    process.env.JWT_SECRET,
                    { expiresIn: '365d' }
                );

                // Send new token in response header
                res.setHeader('New-Token', newToken);
            }

            req.user = {
                _id: user._id,
                email: user.email,
                roles: user.roles,
                firstName: user.firstName,
                lastName: user.lastName
            };

            next();
        } catch (jwtError) {
            console.error('JWT Verification Error:', jwtError);
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired, please login again',
                    code: 'TOKEN_EXPIRED'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = { authenticateToken }; 