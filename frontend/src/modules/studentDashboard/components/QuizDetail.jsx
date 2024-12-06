import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { FiClock, FiCheckCircle, FiXCircle, FiAward, FiArrowLeft } from 'react-icons/fi';
import StudentLayout from './StudentLayout';

const QuizDetail = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { getQuizById, submitQuizAttempt } = useDashboard();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getQuizById(quizId);
                console.log('Quiz data:', response);

                if (response.success && response.data) {
                    setQuiz(response.data);
                    // If quiz is already completed, show results
                    if (response.data.completed) {
                        setSubmitted(true);
                        setResults({
                            score: response.data.progress?.score,
                            questions: response.data.questions
                        });
                    }
                } else {
                    throw new Error('Failed to load quiz');
                }
            } catch (err) {
                console.error('Error fetching quiz:', err);
                setError(err.message || 'Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId, getQuizById]);

    const handleAnswerSelect = (questionIndex, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedOption
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await submitQuizAttempt(quizId, answers);
            if (response.success) {
                setResults(response.data);
                setSubmitted(true);
            }
        } catch (err) {
            setError(err.message || 'Failed to submit quiz');
        } finally {
            setLoading(false);
        }
    };

    // Add check for current question data
    const currentQuestionData = quiz?.questions?.[currentQuestion];

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
                    <div className="ml-4 text-white">Loading quiz...</div>
                </div>
            </StudentLayout>
        );
    }

    if (error) {
        return (
            <StudentLayout>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="text-red-400 mb-4">{error}</div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-yellow-400 hover:text-yellow-300"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </StudentLayout>
        );
    }

    if (!quiz) {
        return (
            <StudentLayout>
                <div className="text-center text-white py-8">Quiz not found</div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleBack}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2"
                        >
                            <FiArrowLeft /> Back to Course
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">{quiz.title}</h1>
                    <p className="text-white/80 mb-4">{quiz.description}</p>
                    <div className="flex items-center text-white/60">
                        <FiClock className="mr-2" />
                        <span>{quiz.questions.length} Questions</span>
                    </div>
                </div>

                {submitted ? (
                    // Quiz Results View
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
                        <div className="text-center">
                            <FiAward className="mx-auto text-6xl text-yellow-400 mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Quiz Completed!</h2>
                            <div className="text-5xl font-bold text-yellow-400 mb-6">
                                {results.score}%
                            </div>
                            <p className="text-white/80 mb-8">
                                You got {results.correctAnswers} out of {results.totalQuestions} questions correct
                            </p>

                            {/* Question Review */}
                            <div className="space-y-6 text-left mt-8">
                                {results.questions.map((q, index) => (
                                    <div key={q._id} className="bg-white/5 rounded-lg p-4">
                                        <p className="text-white mb-4">
                                            <span className="font-semibold">Question {index + 1}:</span> {q.question}
                                        </p>
                                        <div className="grid gap-2">
                                            {q.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg flex items-center justify-between ${
                                                        optIndex === q.correctAnswer
                                                            ? 'bg-green-500/20 border-green-500'
                                                            : optIndex === q.yourAnswer
                                                            ? 'bg-red-500/20 border-red-500'
                                                            : 'bg-white/5'
                                                    } border`}
                                                >
                                                    <span className="text-white">{option}</span>
                                                    {optIndex === q.correctAnswer ? (
                                                        <FiCheckCircle className="text-green-500" />
                                                    ) : optIndex === q.yourAnswer ? (
                                                        <FiXCircle className="text-red-500" />
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate(-1)}
                                className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg"
                            >
                                Return to Course
                            </button>
                        </div>
                    </div>
                ) : quiz?.questions?.length > 0 ? (
                    // Quiz Taking View
                    <>
                        {/* Question Navigation */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {quiz.questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                        currentQuestion === index
                                            ? 'bg-yellow-400 text-black'
                                            : answers[index] !== undefined
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-white/60'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        {/* Current Question */}
                        {currentQuestionData && (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                                <h3 className="text-xl font-semibold text-white mb-6">
                                    Question {currentQuestion + 1}: {currentQuestionData.question}
                                </h3>
                                <div className="space-y-4">
                                    {currentQuestionData.options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(currentQuestion, index)}
                                            className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                                                answers[currentQuestion] === index
                                                    ? 'bg-yellow-400/20 border-yellow-400 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                                            } border`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                                className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {currentQuestion === quiz.questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={Object.keys(answers).length !== quiz.questions.length}
                                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50"
                                >
                                    Submit Quiz
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                                    className="px-6 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center text-white py-8">
                        No questions available for this quiz
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default QuizDetail; 