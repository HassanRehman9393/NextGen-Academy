interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export const validateQuizForm = (data: any): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!data.title?.trim()) {
        errors.title = 'Title is required';
    } else if (data.title.length < 3) {
        errors.title = 'Title must be at least 3 characters';
    }

    if (!data.topic?.trim()) {
        errors.topic = 'Topic is required';
    }

    if (!data.description?.trim()) {
        errors.description = 'Description is required';
    } else if (data.description.length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }

    if (!data.duration || data.duration < 1) {
        errors.duration = 'Duration must be at least 1 minute';
    }

    if (data.passingScore === undefined || data.passingScore < 0 || data.passingScore > 100) {
        errors.passingScore = 'Passing score must be between 0 and 100';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateQuestionForm = (data: any): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!data.questionText?.trim()) {
        errors.questionText = 'Question text is required';
    }

    if (!data.questionType) {
        errors.questionType = 'Question type is required';
    }

    if (!Array.isArray(data.options) || data.options.length < 2) {
        errors.options = 'At least two options are required';
    } else {
        const hasCorrectAnswer = data.options.some((opt: any) => opt.isCorrect);
        if (!hasCorrectAnswer) {
            errors.options = 'At least one correct answer is required';
        }

        if (data.questionType === 'true-false' && data.options.length !== 2) {
            errors.options = 'True/False questions must have exactly two options';
        }
    }

    if (!data.points || data.points < 1) {
        errors.points = 'Points must be at least 1';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 