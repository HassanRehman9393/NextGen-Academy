import React, { createContext, useContext, useState, useEffect } from 'react';
import useQuizManagement from '../hooks/useQuizManagement';
import quizService from '../services/quizService';

const QuizContext = createContext();

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
};

export const QuizProvider = ({ children }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        quizzes,
        loading,
        error,
        fetchQuizzes,
        handleQuizCreate,
        handleQuizUpdate,
        handleQuizDelete,
        handleQuestionAdd,
        handleQuestionUpdate,
        handleQuestionDelete
    } = useQuizManagement();

    // Fetch questions when selected quiz changes
    useEffect(() => {
        if (selectedQuiz) {
            fetchQuizQuestions(selectedQuiz._id);
        }
    }, [selectedQuiz]);

    const fetchQuizQuestions = async (quizId) => {
        try {
            console.log('Fetching questions for quiz:', quizId); // Debug log
            const response = await quizService.getQuizQuestions(quizId);
            console.log('Questions response:', response); // Debug log
            
            // Make sure we're setting the questions array correctly
            const questionsData = response.data?.data || response.data || [];
            console.log('Setting questions:', questionsData); // Debug log
            setQuestions(questionsData);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setQuestions([]); // Reset questions on error
        }
    };

    // Add this effect to log questions changes
    useEffect(() => {
        console.log('Questions updated:', questions);
    }, [questions]);

    const value = {
        quizzes,
        loading,
        error,
        selectedQuiz,
        questions,
        isCreateModalOpen,
        isEditModalOpen,
        isDeleteModalOpen,
        setSelectedQuiz,
        setIsCreateModalOpen,
        setIsEditModalOpen,
        setIsDeleteModalOpen,
        fetchQuizzes,
        handleQuizCreate,
        handleQuizUpdate,
        handleQuizDelete,
        handleQuestionAdd: async (quizId, questionData) => {
            const result = await handleQuestionAdd(quizId, questionData);
            await fetchQuizQuestions(quizId);
            return result;
        },
        handleQuestionUpdate: async (questionId, questionData) => {
            try {
                const result = await handleQuestionUpdate(questionId, questionData);
                if (selectedQuiz) {
                    await fetchQuizQuestions(selectedQuiz._id);
                }
                return result;
            } catch (error) {
                console.error('Error updating question:', error);
                throw error;
            }
        },
        handleQuestionDelete: async (questionId) => {
            try {
                await handleQuestionDelete(questionId);
                if (selectedQuiz) {
                    await fetchQuizQuestions(selectedQuiz._id);
                }
            } catch (error) {
                console.error('Error deleting question:', error);
                throw error;
            }
        }
    };

    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export default QuizProvider; 