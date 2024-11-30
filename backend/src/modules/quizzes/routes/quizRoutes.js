const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/quizController');
const { authenticateToken } = require('../../../middleware/authMiddleware');
const { requireInstructor } = require('../../auth/middleware/roleMiddleware');

// Add logging middleware for debugging
router.use((req, res, next) => {
    console.log('Quiz Route - User:', req.user);
    next();
});

// Apply authentication and instructor role middleware to all routes
router.use(authenticateToken);
router.use(requireInstructor);

// Quiz routes
router.get('/', QuizController.getQuizzes);
router.post('/', QuizController.createQuiz);
router.get('/:id', QuizController.getQuizById);
router.put('/:id', QuizController.updateQuiz);
router.delete('/:id', QuizController.deleteQuiz);

// Question routes
router.post('/:quizId/questions', QuizController.addQuestion);
router.get('/:quizId/questions', QuizController.getQuizQuestions);
router.put('/questions/:questionId', QuizController.updateQuestion);
router.delete('/questions/:questionId', QuizController.deleteQuestion);

module.exports = router; 