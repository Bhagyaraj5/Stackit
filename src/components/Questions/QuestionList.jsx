import React from 'react';
import QuestionCard from './QuestionCard';
import { QuestionCardSkeleton } from '../Common/LoadingSpinner';

const QuestionList = ({ questions, loading, error, onVoteUpdate }) => {
    if (loading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <QuestionCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-danger-500 text-lg font-medium mb-2">
                    Something went wrong
                </div>
                <p className="text-secondary-600">
                    Unable to load questions. Please try again later.
                </p>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-secondary-400 text-6xl mb-4">?</div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                    No questions found
                </h3>
                <p className="text-secondary-600 mb-6">
                    Try adjusting your search or filter criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {questions.map((question) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    onVoteUpdate={onVoteUpdate}
                />
            ))}
        </div>
    );
};

export default QuestionList; 