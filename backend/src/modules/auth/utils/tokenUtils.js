const jwt = require('jsonwebtoken');

class TokenUtils {
    static generateToken(userData) {
        try {
            if (!userData || !userData.userId) {
                throw new Error('Invalid user data for token generation');
            }

            const payload = {
                userId: userData.userId,
                email: userData.email
            };

            return jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
        } catch (error) {
            console.error('Token generation error:', error);
            throw new Error('Token generation failed');
        }
    }

    static verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    static decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error('Token decoding failed');
        }
    }

    static generateVerificationToken(userId) {
        return jwt.sign(
            { userId, purpose: 'verification' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static generatePasswordResetToken(userId) {
        return jwt.sign(
            { 
                userId, 
                purpose: 'password_reset',
                timestamp: Date.now() // Add timestamp to ensure uniqueness
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static generateRefreshToken(userId) {
        return this.generateToken(
            { userId, type: 'refresh' },
            '7d'
        );
    }

    static validateTokenPurpose(token, purpose) {
        try {
            const decoded = this.verifyToken(token);
            if (decoded.purpose !== purpose) {
                throw new Error('Invalid token purpose');
            }
            return decoded;
        } catch (error) {
            throw error;
        }
    }

    static extractUserIdFromToken(token) {
        try {
            const decoded = this.verifyToken(token);
            return decoded.userId;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TokenUtils; 