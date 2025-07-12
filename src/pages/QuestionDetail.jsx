import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    Eye,
    CheckCircle,
    ChevronDown
} from 'lucide-react';
import { questionService } from '../services/questionService';
import { answerService } from '../services/answerService';
import { useAuth } from '../context/AuthContext';
import { questions as mockQuestions, answers as mockAnswers, getQuestionById, getAnswersByQuestionId } from '../utils/mockData';
import AnswerCard from '../components/Answers/AnswerCard';
import AnswerForm from '../components/Answers/AnswerForm';
import AIAnswerAssistant from '../components/AI/AIAnswerAssistant';
import LiveCollaboration from '../components/Realtime/LiveCollaboration';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const QuestionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [voting, setVoting] = useState(false);
    const [localVotes, setLocalVotes] = useState(0);
    const [answerSortBy, setAnswerSortBy] = useState('newest');

    useEffect(() => {
        const loadQuestion = async () => {
            setLoading(true);
            try {
                if (isLoggedIn) {
                    // Use real data for authenticated users
                    const result = await questionService.getQuestion(id);
                    if (result.success) {
                        setQuestion(result.question);
                        setLocalVotes(result.question.votes || 0);
                        setError(null);
                    } else {
                        setError(result.error || 'Question not found');
                    }
                } else {
                    // Use mock data for non-authenticated users
                    const mockQuestion = getQuestionById(parseInt(id));
                    if (mockQuestion) {
                        // Get mock answers for this question
                        const mockQuestionAnswers = getAnswersByQuestionId(parseInt(id));
                        const questionWithAnswers = {
                            ...mockQuestion,
                            answers: mockQuestionAnswers
                        };
                        setQuestion(questionWithAnswers);
                        setLocalVotes(mockQuestion.votes || 0);
                        setError(null);
                    } else {
                        setError('Question not found');
                    }
                }
            } catch (err) {
                setError('Failed to load question');
            } finally {
                setLoading(false);
            }
        };

        loadQuestion();
    }, [id, isLoggedIn]);

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const getTagColor = (tag) => {
        const colors = {
            'React': 'tag-blue',
            'JavaScript': 'tag-orange',
            'TypeScript': 'tag-purple',
            'Node.js': 'tag-green',
            'Express': 'tag-green',
            'API': 'tag-blue',
            'Performance': 'tag-orange',
            'CSS': 'tag-purple',
            'Tailwind CSS': 'tag-blue',
            'Dark Mode': 'tag-purple',
            'Async': 'tag-orange',
            'Promises': 'tag-orange',
            'ES6': 'tag-orange',
            'Error Handling': 'tag-red',
            'Programming': 'tag-blue',
            'Hooks': 'tag-blue'
        };
        return colors[tag] || 'tag-blue';
    };

    const handleQuestionVote = async (voteType) => {
        if (!isLoggedIn) {
            alert('Please log in to vote');
            return;
        }

        if (voting) return;

        setVoting(true);
        try {
            const result = await questionService.voteQuestion(question.id, user.id, voteType);
            if (result.success) {
                setLocalVotes(result.votes);
                setQuestion(prev => ({ ...prev, votes: result.votes }));
            } else {
                alert('Failed to vote: ' + result.error);
            }
        } catch (error) {
            alert('Error voting: ' + error.message);
        } finally {
            setVoting(false);
        }
    };

    const handleAnswerVoteUpdate = (answerId, newVotes) => {
        setQuestion(prev => ({
            ...prev,
            answers: prev.answers.map(answer =>
                answer.id === answerId ? { ...answer, votes: newVotes } : answer
            )
        }));
    };

    const handleAcceptAnswer = (answerId) => {
        setQuestion(prev => ({
            ...prev,
            isAnswered: true,
            acceptedAnswerId: answerId,
            answers: prev.answers.map(answer => ({
                ...answer,
                isAccepted: answer.id === answerId
            }))
        }));
    };

    const handleAnswerSubmitted = (newAnswer) => {
        setQuestion(prev => ({
            ...prev,
            answers: [newAnswer, ...prev.answers]
        }));
    };

    const handleAnswerDelete = (answerId) => {
        setQuestion(prev => ({
            ...prev,
            answers: prev.answers.filter(answer => answer.id !== answerId)
        }));
    };

    const sortAnswers = (answersToSort) => {
        switch (answerSortBy) {
            case 'newest':
                return [...answersToSort].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...answersToSort].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'most-votes':
                return [...answersToSort].sort((a, b) => b.votes - a.votes);
            default:
                return answersToSort;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-danger-500 text-lg font-medium mb-2">
                    {error}
                </div>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Back to Questions
                </Button>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="text-center py-12">
                <div className="text-secondary-500 text-lg font-medium mb-2">
                    Question not found
                </div>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Back to Questions
                </Button>
            </div>
        );
    }

    const sortedAnswers = sortAnswers(question.answers || []);

    const handleUseAISuggestion = (suggestion) => {
        // This would typically update the answer form
        console.log('Using AI suggestion:', suggestion);
        // You could implement this to populate the answer form
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
                {/* Question */}
                <div className="card p-8">
                    <div className="flex items-start space-x-6">
                        {/* Voting Section */}
                        <div className="flex flex-col items-center space-y-2">
                            <button
                                onClick={() => handleQuestionVote('up')}
                                disabled={voting || !isLoggedIn}
                                className="p-2 rounded hover:bg-secondary-100 transition-colors disabled:opacity-50 text-secondary-400 hover:text-primary-600"
                            >
                                <ThumbsUp className="w-6 h-6" />
                            </button>

                            <span className="text-2xl font-bold text-secondary-700">
                                {localVotes}
                            </span>

                            <button
                                onClick={() => handleQuestionVote('down')}
                                disabled={voting || !isLoggedIn}
                                className="p-2 rounded hover:bg-secondary-100 transition-colors disabled:opacity-50 text-secondary-400 hover:text-danger-600"
                            >
                                <ThumbsDown className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                                {question.title}
                            </h1>

                            {/* Description */}
                            <div className="prose prose-lg max-w-none mb-6">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{question.description}</ReactMarkdown>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {question.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className={`${getTagColor(tag)} text-sm font-medium`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Meta Information */}
                            <div className="flex items-center justify-between text-sm text-secondary-500">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <span className="font-medium text-secondary-700">
                                            {question.author?.username || 'Anonymous'}
                                        </span>
                                        <span className="mx-1">•</span>
                                        <span>{formatTimeAgo(question.createdAt)}</span>
                                    </span>

                                    <div className="flex items-center space-x-4">
                                        <span className="flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-1" />
                                            {question.answers?.length || 0} answers
                                        </span>
                                        <span className="flex items-center">
                                            <Eye className="w-4 h-4 mr-1" />
                                            {question.views || 0} views
                                        </span>
                                    </div>
                                </div>

                                {question.isAnswered && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Answered
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Answers Section */}
                <div className="space-y-6">
                    {/* Answers Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-secondary-900">
                            {sortedAnswers.length} Answer{sortedAnswers.length !== 1 ? 's' : ''}
                        </h2>

                        {/* Sort Answers */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-secondary-600">Sort by:</span>
                            <select
                                value={answerSortBy}
                                onChange={(e) => setAnswerSortBy(e.target.value)}
                                className="px-3 py-1 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="most-votes">Most Votes</option>
                            </select>
                        </div>
                    </div>

                    {/* Answers List */}
                    {sortedAnswers.length > 0 ? (
                        <div className="space-y-6">
                            {sortedAnswers.map((answer) => (
                                <AnswerCard
                                    key={answer.id}
                                    answer={answer}
                                    questionId={question.id}
                                    questionAuthorId={question.author.id}
                                    onVoteUpdate={handleAnswerVoteUpdate}
                                    onAcceptUpdate={handleAcceptAnswer}
                                    onDelete={handleAnswerDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-secondary-400 text-6xl mb-4">💭</div>
                            <h3 className="text-lg font-medium text-secondary-900 mb-2">
                                No answers yet
                            </h3>
                            <p className="text-secondary-600 mb-6">
                                Be the first to answer this question!
                            </p>
                        </div>
                    )}

                    {/* Answer Form */}
                    <AnswerForm
                        questionId={question.id}
                        onAnswerSubmitted={handleAnswerSubmitted}
                    />
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                {/* AI Answer Assistant */}
                <AIAnswerAssistant
                    questionTitle={question.title}
                    questionDescription={question.description}
                    onUseSuggestion={handleUseAISuggestion}
                />

                {/* Live Collaboration */}
                <LiveCollaboration
                    questionId={question.id}
                    currentUser={user}
                />
            </div>
        </div>
    );
};

export default QuestionDetail; 