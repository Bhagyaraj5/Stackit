import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { answerService } from '../../services/answerService';
import Button from '../UI/Button';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const AnswerForm = ({ questionId, onAnswerSubmitted }) => {
    const { isLoggedIn, user } = useAuth();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            setError('Please sign in to post an answer');
            return;
        }

        if (!content.trim()) {
            setError('Please enter your answer');
            return;
        }

        if (content.trim().length < 10) {
            setError('Answer must be at least 10 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await answerService.createAnswer({
                questionId: questionId,
                content: content.trim()
            }, user.id);

            if (result.success) {
                setContent('');
                if (onAnswerSubmitted) {
                    onAnswerSubmitted(result.answer);
                }
            } else {
                setError(result.error || 'Failed to post answer');
            }
        } catch (error) {
            setError('Error posting answer: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="card p-6 text-center">
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    Sign in to answer
                </h3>
                <p className="text-secondary-600 mb-4">
                    You need to be signed in to post an answer to this question.
                </p>
                <Button variant="primary" size="sm">
                    Sign In
                </Button>
            </div>
        );
    }

    return (
        <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
                <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                    alt={user?.username || 'User'}
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <h3 className="text-lg font-medium text-secondary-900">
                        Your Answer
                    </h3>
                    <p className="text-sm text-secondary-500">
                        Answering as {user?.username || 'User'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="Write your answer here... You can use markdown formatting."
                        className="w-full h-32 px-3 py-2 border-2 border-secondary-200 dark:border-charcoal-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors duration-200 resize-none dark:bg-charcoal-800 dark:text-secondary-100"
                        disabled={loading}
                    />
                    {error && (
                        <p className="mt-1 text-sm text-danger-600">{error}</p>
                    )}
                    <p className="mt-1 text-xs text-secondary-500">
                        {content.length} characters (minimum 10)
                    </p>
                </div>
                {content.trim() && (
                    <div className="mb-4">
                        <div className="text-xs text-secondary-500 mb-1">Markdown Preview:</div>
                        <div className="prose prose-sm max-w-none border border-secondary-200 rounded p-3 bg-secondary-50">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="text-sm text-secondary-600">
                        <p>• Use markdown for formatting</p>
                        <p>• Be clear and concise</p>
                        <p>• Provide code examples when relevant</p>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        disabled={!content.trim() || loading}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Post Answer
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AnswerForm; 