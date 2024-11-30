import { useState, useCallback } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import quizService from '../services/quizService';

const useQuizManagement = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuizzes = useCallback(async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await quizService.getQuizzes();
            setQuizzes(response.data?.data || response.data || []);
        } catch (err) {
            console.error('Error fetching quizzes:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const handleQuizCreate = async (quizData) => {
        setLoading(true);
        try {
            const response = await quizService.createQuiz(quizData);
            await fetchQuizzes();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleQuizUpdate = async (quizId, quizData) => {
        setLoading(true);
        try {
            const response = await quizService.updateQuiz(quizId, quizData);
            await fetchQuizzes();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleQuizDelete = async (quizId) => {
        setLoading(true);
        try {
            await quizService.deleteQuiz(quizId);
            await fetchQuizzes();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionAdd = async (quizId, questionData) => {
        setLoading(true);
        try {
            const response = await quizService.addQuestion(quizId, questionData);
            await fetchQuizzes();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionUpdate = async (questionId, questionData) => {
        setLoading(true);
        try {
            const response = await quizService.updateQuestion(questionId, questionData);
            await fetchQuizzes();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionDelete = async (questionId) => {
        setLoading(true);
        try {
            await quizService.deleteQuestion(questionId);
            await fetchQuizzes();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
};

export default useQuizManagement; 