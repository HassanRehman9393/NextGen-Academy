export const validateForumData = (data) => {
    const errors = {};

    if (!data.title?.trim()) {
        errors.title = 'Title is required';
    } else if (data.title.length < 10) {
        errors.title = 'Title must be at least 10 characters';
    }

    if (!data.topic?.trim()) {
        errors.topic = 'Topic is required';
    } else if (data.topic.length < 5) {
        errors.topic = 'Topic must be at least 5 characters';
    }

    if (!data.description?.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.length < 50) {
        errors.description = 'Description must be at least 50 characters';
    }

    if (!data.courseId) {
        errors.courseId = 'Course selection is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 