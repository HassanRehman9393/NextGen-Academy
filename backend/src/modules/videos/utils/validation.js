const validateVideoInput = (data) => {
    const errors = {};

    if (!data.title) {
        errors.title = 'Title is required';
    } else if (data.title.length < 3 || data.title.length > 100) {
        errors.title = 'Title must be between 3 and 100 characters';
    }

    if (!data.description) {
        errors.description = 'Description is required';
    } else if (data.description.length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }

    if (!data.category) {
        errors.category = 'Category is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = { validateVideoInput }; 