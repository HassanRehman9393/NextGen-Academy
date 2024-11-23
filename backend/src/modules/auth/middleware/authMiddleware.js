const TokenUtils = require('../utils/tokenUtils');

class AuthMiddleware {
    // Verify JWT token
    static authenticateToken(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

            if (!token) {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }

            const decoded = TokenUtils.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
    }

    // Role-based authorization
    static authorizeRoles(...allowedRoles) {
        return (req, res, next) => {
            if (!req.user || !req.user.roles) {
                return res.status(403).json({ message: 'Access denied. No role specified.' });
            }

            const hasAllowedRole = req.user.roles.some(role => allowedRoles.includes(role));
            if (!hasAllowedRole) {
                return res.status(403).json({ 
                    message: 'Access denied. Insufficient privileges.' 
                });
            }

            next();
        };
    }

    // Check if user is verified
    static requireVerifiedEmail(req, res, next) {
        if (!req.user.isVerified) {
            return res.status(403).json({ 
                message: 'Please verify your email address before proceeding.' 
            });
        }
        next();
    }

    // Rate limiting middleware
    static rateLimiter(maxRequests, timeWindow) {
        const requests = new Map();

        return (req, res, next) => {
            const ip = req.ip;
            const now = Date.now();
            const userRequests = requests.get(ip) || [];
            
            // Remove old requests outside the time window
            const recentRequests = userRequests.filter(time => time > now - timeWindow);
            
            if (recentRequests.length >= maxRequests) {
                return res.status(429).json({ 
                    message: 'Too many requests. Please try again later.' 
                });
            }

            recentRequests.push(now);
            requests.set(ip, recentRequests);
            next();
        };
    }

    // Session validation for sensitive operations
    static requireRecentLogin(maxAge = 3600000) { // 1 hour default
        return (req, res, next) => {
            const loginTimestamp = req.user.iat * 1000; // Convert to milliseconds
            const now = Date.now();

            if (now - loginTimestamp > maxAge) {
                return res.status(401).json({ 
                    message: 'Please log in again to perform this action.' 
                });
            }
            next();
        };
    }

    // Instructor-specific middleware
    static requireInstructor(req, res, next) {
        if (!req.user.roles.includes('instructor')) {
            return res.status(403).json({ 
                message: 'Access denied. Instructor privileges required.' 
            });
        }
        next();
    }

    // Admin-specific middleware
    static requireAdmin(req, res, next) {
        if (!req.user.roles.includes('admin')) {
            return res.status(403).json({ 
                message: 'Access denied. Admin privileges required.' 
            });
        }
        next();
    }
}

module.exports = AuthMiddleware; 