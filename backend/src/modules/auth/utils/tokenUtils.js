const jwt = require('jsonwebtoken');

class TokenUtils {
    static generateToken(userData, purpose = 'auth') {
        try {
            // Ensure required user data is present
            if (!userData || !userData._id) {
                console.error('Invalid user data:', userData);
                throw new Error('Invalid user data for token generation');
            }

            // Create a standardized payload
            const payload = {
                userId: userData._id.toString(),
                email: userData.email,
                roles: userData.roles || ['student'],
                purpose: purpose
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return token;
        } catch (error) {
            console.error('Token generation error:', error);
            throw new Error('Token generation failed');
        }
    }

    static generateVerificationToken(userId) {
        return this.generateToken({ _id: userId }, 'verification');
    }

    static generatePasswordResetToken(userId) {
        return this.generateToken({ _id: userId }, 'password_reset');
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error('Token verification error:', error);
            throw new Error('Invalid or expired token');
        }
    }

    static validateTokenPurpose(token, expectedPurpose) {
        const decoded = this.verifyToken(token);
        if (decoded.purpose !== expectedPurpose) {
            throw new Error('Invalid token purpose');
        }
        return decoded;
    }
}

module.exports = TokenUtils; 