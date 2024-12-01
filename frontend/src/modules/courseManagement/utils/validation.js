export const validateCourse = (courseData) => {
    const errors = {};

    // Title validation
    if (!courseData.title?.trim()) {
        errors.title = 'Course title is required';
    } else if (courseData.title.length < 3) {
        errors.title = 'Course title must be at least 3 characters long';
    } else if (courseData.title.length > 100) {
        errors.title = 'Course title cannot exceed 100 characters';
    }

    // Description validation
    if (!courseData.description?.trim()) {
        errors.description = 'Course description is required';
    } else if (courseData.description.length < 10) {
        errors.description = 'Course description must be at least 10 characters long';
    }

    // Difficulty level validation
    if (!courseData.difficultyLevel) {
        errors.difficultyLevel = 'Please select a difficulty level';
    } else if (!['beginner', 'intermediate', 'advanced'].includes(courseData.difficultyLevel)) {
        errors.difficultyLevel = 'Invalid difficulty level';
    }

    // Sequence validation (if present)
    if (courseData.sequence) {
        if (!Array.isArray(courseData.sequence)) {
            errors.sequence = 'Invalid sequence format';
        } else {
            const sequenceErrors = [];
            const seenOrders = new Set();

            courseData.sequence.forEach((item, index) => {
                if (!item.contentType || !['video', 'quiz'].includes(item.contentType)) {
                    sequenceErrors.push(`Invalid content type at position ${index + 1}`);
                }
                if (!item.contentId) {
                    sequenceErrors.push(`Missing content ID at position ${index + 1}`);
                }
                if (!item.order || seenOrders.has(item.order)) {
                    sequenceErrors.push(`Invalid or duplicate order at position ${index + 1}`);
                }
                seenOrders.add(item.order);
            });

            if (sequenceErrors.length > 0) {
                errors.sequence = sequenceErrors;
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateSequence = (sequence) => {
    const errors = [];
    const seenOrders = new Set();

    if (!Array.isArray(sequence)) {
        return {
            isValid: false,
            errors: ['Invalid sequence format']
        };
    }

    sequence.forEach((item, index) => {
        if (!item.contentType || !['video', 'quiz'].includes(item.contentType)) {
            errors.push(`Invalid content type at position ${index + 1}`);
        }
        if (!item.contentId) {
            errors.push(`Missing content ID at position ${index + 1}`);
        }
        if (!item.order || seenOrders.has(item.order)) {
            errors.push(`Invalid or duplicate order at position ${index + 1}`);
        }
        seenOrders.add(item.order);
    });

    return {
        isValid: errors.length === 0,
        errors
    };
}; 