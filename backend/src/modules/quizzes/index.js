const quizRoutes = require('./routes/quizRoutes');
const QuizService = require('./services/quizService');
const Quiz = require('./models/quizModel');
const Question = require('./models/questionModel');

module.exports = {
    quizRoutes,
    QuizService,
    Quiz,
    Question
}; 