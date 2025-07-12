import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { questionService } from '../services/questionService';
import QuestionList from '../components/Questions/QuestionList';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const MyQuestions = () => {
    const { user, isLoggedIn } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        questionService.getQuestions({})
            .then(result => {
                if (result.success) {
                    setQuestions(result.questions.filter(q => q.author_id === user.id));
                    setError(null);
                } else {
                    setError(result.error || 'Failed to load your questions');
                }
            })
            .catch(() => setError('Failed to load your questions'))
            .finally(() => setLoading(false));
    }, [user]);

    if (!isLoggedIn) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                    Please sign in to view your questions
                </h1>
                <Button variant="primary" onClick={() => navigate('/auth')}>
                    Sign In
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">My Questions</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-danger-600">{error}</div>
            ) : questions.length === 0 ? (
                <div className="text-secondary-500">You haven't posted any questions yet.</div>
            ) : (
                <QuestionList questions={questions} />
            )}
        </div>
    );
};

export default MyQuestions; 