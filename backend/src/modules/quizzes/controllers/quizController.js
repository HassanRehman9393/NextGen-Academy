const QuizService = require('../services/quizService');
const Question = require('../models/questionModel');

class QuizController {
    async createQuiz(req, res) {
        try {
            const quiz = await QuizService.createQuiz(req.body, req.user._id);
            res.status(201).json({
                success: true,
                data: quiz
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getQuizzes(req, res) {
        try {
            console.log('User in request:', req.user);
            const quizzes = await QuizService.getQuizzesByInstructor(req.user._id);
            res.json({
                success: true,
                data: quizzes
            });
        } catch (error) {
            console.error('Error in getQuizzes:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getQuizById(req, res) {
        try {
            const quiz = await QuizService.getQuizById(req.params.id, req.user._id);
            res.json({
                success: true,
                data: quiz
            });
        } catch (error) {
            res.status(error.message.includes('not found') ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateQuiz(req, res) {
        try {
            const quiz = await QuizService.updateQuiz(
                req.params.id,
                req.body,
                req.user._id
            );
            res.json({
                success: true,
                data: quiz
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteQuiz(req, res) {
        try {
            await QuizService.deleteQuiz(req.params.id, req.user._id);
            res.json({
                success: true,
                message: 'Quiz deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async addQuestion(req, res) {
        try {
            const { quizId } = req.params;
            const questionData = req.body;

            if (!questionData.order) {
                const lastQuestion = await Question.findOne({ quizId })
                    .sort({ order: -1 })
                    .limit(1);
                questionData.order = lastQuestion ? lastQuestion.order + 1 : 1;
            }

            const question = await Question.create({
                ...questionData,
                quizId
            });

            res.status(201).json({
                success: true,
                data: question
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getQuizQuestions(req, res) {
        try {
            const { quizId } = req.params;
            console.log('Fetching questions for quiz:', quizId); // Debug log

            const questions = await Question.find({ quizId }).sort({ order: 1 });
            console.log('Found questions:', questions); // Debug log

            res.json({
                success: true,
                data: questions
            });
        } catch (error) {
            console.error('Error getting quiz questions:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateQuestion(req, res) {
        try {
            const question = await QuizService.updateQuestion(
                req.params.questionId,
                req.body,
                req.user._id
            );
            res.json({
                success: true,
                data: question
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteQuestion(req, res) {
        try {
            const { questionId } = req.params;
            
            // Find the question first to get its quizId
            const question = await Question.findById(questionId);
            if (!question) {
                return res.status(404).json({
                    success: false,
                    message: 'Question not found'
                });
            }

            // Delete the question
            await Question.findByIdAndDelete(questionId);

            // Get remaining questions for the quiz
            const remainingQuestions = await Question.find({ quizId: question.quizId })
                .sort({ order: 1 });

            // Reorder remaining questions
            for (let i = 0; i < remainingQuestions.length; i++) {
                await Question.findByIdAndUpdate(remainingQuestions[i]._id, { order: i + 1 });
            }

            res.json({
                success: true,
                message: 'Question deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting question:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new QuizController(); 