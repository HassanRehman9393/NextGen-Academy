const Quiz = require('../models/quizModel');
const Question = require('../models/questionModel');
const { validateQuiz, validateQuestion, validateQuestionOptions } = require('../utils/validation');

class QuizService {
    async createQuiz(quizData, instructorId) {
        const { error } = validateQuiz(quizData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const quiz = new Quiz({
            ...quizData,
            instructor: instructorId
        });

        return await quiz.save();
    }

    async getQuizzesByInstructor(instructorId) {
        console.log('Getting quizzes for instructor:', instructorId);
        const quizzes = await Quiz.find({ instructor: instructorId })
            .sort({ createdAt: -1 });
        console.log('Found quizzes:', quizzes);
        return quizzes;
    }

    async getQuizById(quizId, instructorId) {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        if (quiz.instructor.toString() !== instructorId.toString()) {
            throw new Error('Unauthorized access to quiz');
        }
        return quiz;
    }

    async updateQuiz(quizId, updateData, instructorId) {
        const quiz = await this.getQuizById(quizId, instructorId);
        
        const { error } = validateQuiz(updateData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        return await Quiz.findByIdAndUpdate(
            quizId,
            { ...updateData, updatedAt: Date.now() },
            { new: true }
        );
    }

    async deleteQuiz(quizId, instructorId) {
        const quiz = await this.getQuizById(quizId, instructorId);
        await Question.deleteMany({ quiz: quizId });
        await Quiz.findByIdAndDelete(quizId);
    }

    async addQuestion(quizId, questionData, instructorId) {
        const quiz = await this.getQuizById(quizId, instructorId);
        
        const { error } = validateQuestion(questionData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const optionsValidation = validateQuestionOptions(
            questionData.options,
            questionData.questionType
        );
        if (!optionsValidation.isValid) {
            throw new Error(optionsValidation.error);
        }

        const question = new Question({
            ...questionData,
            quiz: quizId
        });

        return await question.save();
    }

    async getQuizQuestions(quizId, instructorId) {
        await this.getQuizById(quizId, instructorId);
        return await Question.find({ quiz: quizId })
            .sort({ order: 1 });
    }

    async updateQuestion(questionId, updateData, instructorId) {
        const question = await Question.findById(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        const quiz = await this.getQuizById(question.quiz, instructorId);

        const { error } = validateQuestion(updateData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        return await Question.findByIdAndUpdate(
            questionId,
            updateData,
            { new: true }
        );
    }

    async deleteQuestion(questionId, instructorId) {
        const question = await Question.findById(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        await this.getQuizById(question.quiz, instructorId);
        await Question.findByIdAndDelete(questionId);
    }
}

module.exports = new QuizService(); 