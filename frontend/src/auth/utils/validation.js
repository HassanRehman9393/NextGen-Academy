export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const validateName = (name) => {
    return name && name.length >= 2;
};

export const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
};

export const getValidationErrors = (formData) => {
    const errors = {};

    if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
        errors.password = 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.firstName && !validateName(formData.firstName)) {
        errors.firstName = 'First name must be at least 2 characters long';
    }

    if (formData.lastName && !validateName(formData.lastName)) {
        errors.lastName = 'Last name must be at least 2 characters long';
    }

    return errors;
}; 