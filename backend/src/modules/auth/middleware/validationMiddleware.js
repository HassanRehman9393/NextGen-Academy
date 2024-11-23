class ValidationMiddleware {
    // Helper method to validate email format
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper method to validate password strength
    static isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Validate registration data
    static validateRegistration(req, res, next) {
        const { email, password, firstName, lastName } = req.body;
        const errors = [];

        // Email validation
        if (!email || !ValidationMiddleware.isValidEmail(email)) {
            errors.push('Please provide a valid email address');
        }

        // Password validation
        if (!password || !ValidationMiddleware.isValidPassword(password)) {
            errors.push(
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            );
        }

        // Name validation
        if (!firstName || firstName.length < 2) {
            errors.push('First name must be at least 2 characters long');
        }

        if (!lastName || lastName.length < 2) {
            errors.push('Last name must be at least 2 characters long');
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    }

    // Validate login data
    static validateLogin(req, res, next) {
        const { email, password } = req.body;
        const errors = [];

        if (!email || !ValidationMiddleware.isValidEmail(email)) {
            errors.push('Please provide a valid email address');
        }

        if (!password || password.length < 8) {
            errors.push('Please provide a valid password');
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    }

    // Validate password reset request
    static validatePasswordReset(req, res, next) {
        const { password, confirmPassword } = req.body;
        const errors = [];

        if (!password || !ValidationMiddleware.isValidPassword(password)) {
            errors.push(
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            );
        }

        if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    }

    // Validate profile update
    static validateProfileUpdate(req, res, next) {
        const { firstName, lastName, bio } = req.body;
        const errors = [];

        if (firstName && firstName.length < 2) {
            errors.push('First name must be at least 2 characters long');
        }

        if (lastName && lastName.length < 2) {
            errors.push('Last name must be at least 2 characters long');
        }

        if (bio && bio.length > 500) {
            errors.push('Bio must not exceed 500 characters');
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    }

    // Sanitize user input
    static sanitizeInput(req, res, next) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
        next();
    }

    // Validate course creation/update
    static validateCourse(req, res, next) {
        const { title, description, duration, price } = req.body;
        const errors = [];

        if (!title || title.length < 5) {
            errors.push('Course title must be at least 5 characters long');
        }

        if (!description || description.length < 20) {
            errors.push('Course description must be at least 20 characters long');
        }

        if (!duration || isNaN(duration) || duration <= 0) {
            errors.push('Course duration must be a positive number');
        }

        if (price && (isNaN(price) || price < 0)) {
            errors.push('Course price must be a non-negative number');
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    }
}

module.exports = ValidationMiddleware; 