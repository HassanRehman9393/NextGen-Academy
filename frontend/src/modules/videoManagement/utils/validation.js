export const validateVideoForm = (data) => {
    const errors = {};

    if (!data.title?.trim()) {
        errors.title = 'Title is required';
    } else if (data.title.length < 3 || data.title.length > 100) {
        errors.title = 'Title must be between 3 and 100 characters';
    }

    if (!data.description?.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }

    if (!data.category?.trim()) {
        errors.category = 'Category is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateYoutubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
}; 