const Joi = require('joi');

const quizValidationSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    topic: Joi.string().required().min(2).max(50),
    description: Joi.string().required().min(10),
    duration: Joi.number().required().min(1),
    passingScore: Joi.number().required().min(0).max(100),
    isPublished: Joi.boolean()
});

const questionValidationSchema = Joi.object({
    questionText: Joi.string().required().min(3),
    questionType: Joi.string().valid('multiple-choice', 'true-false').required(),
    options: Joi.array().items(
        Joi.object({
            text: Joi.string().required(),
            isCorrect: Joi.boolean().required()
        })
    ).min(2).when('questionType', {
        is: 'multiple-choice',
        then: Joi.array().min(3).max(6),
        otherwise: Joi.array().length(2)
    }),
    points: Joi.number().default(1),
    explanation: Joi.string(),
    order: Joi.number().required()
});

const validateQuiz = (data) => {
    return quizValidationSchema.validate(data);
};

const validateQuestion = (data) => {
    return questionValidationSchema.validate(data);
};

const validateQuestionOptions = (options, questionType) => {
    // Ensure at least one correct answer
    const correctAnswers = options.filter(opt => opt.isCorrect);
    if (correctAnswers.length === 0) {
        return { isValid: false, error: 'At least one correct answer is required' };
    }

    // For true-false, ensure exactly two options
    if (questionType === 'true-false') {
        if (options.length !== 2) {
            return { isValid: false, error: 'True/False questions must have exactly two options' };
        }
        if (correctAnswers.length !== 1) {
            return { isValid: false, error: 'True/False questions must have exactly one correct answer' };
        }
    }

    return { isValid: true };
};

module.exports = {
    validateQuiz,
    validateQuestion,
    validateQuestionOptions
}; 