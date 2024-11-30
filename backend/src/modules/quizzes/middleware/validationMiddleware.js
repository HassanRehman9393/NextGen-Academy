const { validateQuiz, validateQuestion } = require('../utils/validation');

const validateQuizData = (req, res, next) => {
    const { error } = validateQuiz(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

const validateQuestionData = (req, res, next) => {
    const { error } = validateQuestion(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};

module.exports = {
    validateQuizData,
    validateQuestionData
}; 