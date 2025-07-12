import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { questionService } from '../../services/questionService';

const QuestionCard = ({ question, onVoteUpdate }) => {
    const { user } = useAuth();
    const [voting, setVoting] = useState(false);
    const [localVotes, setLocalVotes] = useState(question.votes || 0);

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const truncateDescription = (text, maxLength = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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

    const handleVote = async (voteType) => {
        if (!user) {
            alert('Please log in to vote');
            return;
        }

        if (voting) return;

        setVoting(true);
        try {
            const result = await questionService.voteQuestion(question.id, user.id, voteType);
            if (result.success) {
                setLocalVotes(result.votes);
                if (onVoteUpdate) {
                    onVoteUpdate(question.id, result.votes);
                }
            } else {
                alert('Failed to vote: ' + result.error);
            }
        } catch (error) {
            alert('Error voting: ' + error.message);
        } finally {
            setVoting(false);
        }
    };

    return (
        <div className="card p-6 hover:shadow-lg transition-shadow duration-200 dark:bg-charcoal-800 dark:border-charcoal-700">
            <div className="flex items-start space-x-4">
                {/* Author Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={question.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt={question.author?.username || 'User'}
                        className="w-12 h-12 rounded-full"
                    />
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <Link
                        to={`/question/${question.id}`}
                        className="block text-lg font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200 mb-2"
                    >
                        {question.title}
                    </Link>

                    {/* Description */}
                    <p className="text-secondary-600 dark:text-secondary-300 text-sm leading-relaxed mb-3 line-clamp-2">
                        {truncateDescription(question.description)}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className={`${getTagColor(tag)} text-xs font-medium`}
                            >
                                {tag}
                            </span>
                        ))}
                        {question.tags && question.tags.length > 3 && (
                            <span className="tag bg-secondary-100 dark:bg-charcoal-700 text-secondary-600 dark:text-secondary-300 text-xs font-medium">
                                +{question.tags.length - 3} more
                            </span>
                        )}
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400">
                        <div className="flex items-center space-x-4">
                            {/* Author */}
                            <span className="flex items-center">
                                <span className="font-medium text-secondary-700 dark:text-secondary-200">
                                    {question.author?.username || 'Anonymous'}
                                </span>
                                <span className="mx-1">•</span>
                                <span>{formatTimeAgo(question.createdAt)}</span>
                            </span>

                            {/* Stats */}
                            <div className="flex items-center space-x-4">
                                {/* Votes */}
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => handleVote('up')}
                                        disabled={voting}
                                        className="p-1 hover:bg-secondary-100 dark:hover:bg-charcoal-700 rounded transition-colors disabled:opacity-50"
                                    >
                                        <ThumbsUp className="w-4 h-4 text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-300" />
                                    </button>
                                    <span className="font-medium">{localVotes}</span>
                                    <button
                                        onClick={() => handleVote('down')}
                                        disabled={voting}
                                        className="p-1 hover:bg-secondary-100 dark:hover:bg-charcoal-700 rounded transition-colors disabled:opacity-50"
                                    >
                                        <ThumbsDown className="w-4 h-4 text-secondary-400 dark:text-secondary-500 hover:text-danger-600 dark:hover:text-danger-400" />
                                    </button>
                                </div>

                                {/* Answers */}
                                <span className="flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    {question.answers?.length || 0}
                                    {question.isAnswered && (
                                        <CheckCircle className="w-4 h-4 ml-1 text-success-500 dark:text-success-200" />
                                    )}
                                </span>

                                {/* Views */}
                                <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {question.views || 0}
                                </span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        {question.isAnswered && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Answered
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard; 