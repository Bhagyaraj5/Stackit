import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { answerService } from '../../services/answerService';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const AnswerCard = ({ answer, questionId, questionAuthorId, onVoteUpdate, onAcceptUpdate, onDelete }) => {
    const { user, isLoggedIn } = useAuth();
    const [voting, setVoting] = useState(false);
    const [localVotes, setLocalVotes] = useState(answer.votes || 0);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(answer.content);
    const [saving, setSaving] = useState(false);

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const handleVote = async (voteType) => {
        if (!isLoggedIn) {
            alert('Please log in to vote');
            return;
        }

        if (voting) return;

        setVoting(true);
        try {
            const result = await answerService.voteAnswer(answer.id, user.id, voteType);
            if (result.success) {
                setLocalVotes(result.votes);
                if (onVoteUpdate) {
                    onVoteUpdate(answer.id, result.votes);
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

    const handleAccept = async () => {
        if (!isLoggedIn || user.id !== questionAuthorId) {
            alert('Only the question author can accept answers');
            return;
        }

        try {
            const result = await answerService.acceptAnswer(answer.id, questionId, user.id);
            if (result.success) {
                if (onAcceptUpdate) {
                    onAcceptUpdate(answer.id);
                }
            } else {
                alert('Failed to accept answer: ' + result.error);
            }
        } catch (error) {
            alert('Error accepting answer: ' + error.message);
        }
    };

    const handleEdit = async () => {
        if (!isLoggedIn || user.id !== answer.author.id) {
            alert('You can only edit your own answers');
            return;
        }

        if (saving) return;

        setSaving(true);
        try {
            const result = await answerService.updateAnswer(answer.id, editContent, user.id);
            if (result.success) {
                setIsEditing(false);
                // Update the answer content in the parent component
                if (onVoteUpdate) {
                    onVoteUpdate(answer.id, localVotes, editContent);
                }
            } else {
                alert('Failed to update answer: ' + result.error);
            }
        } catch (error) {
            alert('Error updating answer: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!isLoggedIn || user.id !== answer.author.id) {
            alert('You can only delete your own answers');
            return;
        }

        if (!confirm('Are you sure you want to delete this answer?')) {
            return;
        }

        try {
            const result = await answerService.deleteAnswer(answer.id, user.id);
            if (result.success) {
                if (onDelete) {
                    onDelete(answer.id);
                }
            } else {
                alert('Failed to delete answer: ' + result.error);
            }
        } catch (error) {
            alert('Error deleting answer: ' + error.message);
        }
    };

    const canAccept = isLoggedIn && user?.id === questionAuthorId && !answer.isAccepted;
    const canEdit = isLoggedIn && user?.id === answer.author.id;
    const canDelete = isLoggedIn && user?.id === answer.author.id;

    return (
        <div className={`card p-6 ${answer.isAccepted ? 'border-success-300 bg-success-50 dark:bg-success-900' : 'dark:bg-charcoal-800 dark:border-charcoal-700'}`}>
            <div className="flex items-start space-x-4">
                {/* Voting Section */}
                <div className="flex flex-col items-center space-y-2">
                    <button
                        onClick={() => handleVote('up')}
                        disabled={voting || !isLoggedIn}
                        className="p-1 rounded hover:bg-secondary-100 dark:hover:bg-charcoal-700 transition-colors disabled:opacity-50 text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-300"
                    >
                        <ThumbsUp className="w-5 h-5" />
                    </button>

                    <span className="text-lg font-semibold text-secondary-700 dark:text-secondary-200">
                        {localVotes}
                    </span>

                    <button
                        onClick={() => handleVote('down')}
                        disabled={voting || !isLoggedIn}
                        className="p-1 rounded hover:bg-secondary-100 dark:hover:bg-charcoal-700 transition-colors disabled:opacity-50 text-secondary-400 dark:text-secondary-500 hover:text-danger-600 dark:hover:text-danger-400"
                    >
                        <ThumbsDown className="w-5 h-5" />
                    </button>

                    {/* Accept Answer Button */}
                    {canAccept && (
                        <button
                            onClick={handleAccept}
                            className="mt-2 p-2 text-success-600 dark:text-success-200 hover:bg-success-100 dark:hover:bg-success-900 rounded-lg transition-colors"
                            title="Accept this answer"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </button>
                    )}

                    {/* Accepted Badge */}
                    {answer.isAccepted && (
                        <div className="mt-2 p-2 bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-200 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {/* Answer Content */}
                <div className="flex-1 min-w-0">
                    {/* Answer Text */}
                    {isEditing ? (
                        <div className="mb-4">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 border border-secondary-300 dark:border-charcoal-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-charcoal-800 dark:text-secondary-100"
                                rows="4"
                                placeholder="Write your answer..."
                            />
                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={handleEdit}
                                    disabled={saving}
                                    className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditContent(answer.content);
                                    }}
                                    disabled={saving}
                                    className="px-3 py-1 bg-secondary-200 dark:bg-charcoal-700 text-secondary-700 dark:text-secondary-200 rounded text-sm hover:bg-secondary-300 dark:hover:bg-charcoal-600 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-sm max-w-none mb-4 dark:prose-invert">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{answer.content}</ReactMarkdown>
                        </div>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src={answer.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                                alt={answer.author?.username || 'User'}
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                    {answer.author?.username || 'Anonymous'}
                                </span>
                                <div className="text-xs text-secondary-500 dark:text-secondary-400">
                                    {formatTimeAgo(answer.createdAt)}
                                    {answer.updatedAt !== answer.createdAt && (
                                        <span className="ml-1">(edited)</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center text-sm text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Comment
                            </button>

                            {canEdit && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center text-sm text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center text-sm text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnswerCard; 