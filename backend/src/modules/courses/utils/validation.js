const Joi = require('joi');

const courseValidationSchema = Joi.object({
    title: Joi.string().required().min(3).max(100)
        .messages({
            'string.empty': 'Course title is required',
            'string.min': 'Course title must be at least 3 characters long',
            'string.max': 'Course title cannot exceed 100 characters'
        }),
    description: Joi.string().required().min(10)
        .messages({
            'string.empty': 'Course description is required',
            'string.min': 'Course description must be at least 10 characters long'
        }),
    difficultyLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required()
        .messages({
            'any.only': 'Invalid difficulty level',
            'any.required': 'Difficulty level is required'
        }),
    sequence: Joi.array().items(
        Joi.object({
            _id: Joi.any(),
            contentType: Joi.string().valid('video', 'quiz').required(),
            contentId: Joi.string().required(),
            contentModel: Joi.string().valid('Video', 'Quiz').required(),
            order: Joi.number().required(),
            title: Joi.string(),
            duration: Joi.string()
        })
    ),
    isPublished: Joi.boolean()
});

const validateCourse = (courseData) => {
    return courseValidationSchema.validate(courseData, { abortEarly: false });
};

module.exports = {
    validateCourse
}; 