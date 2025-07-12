import React from 'react';

const LoadingSpinner = ({
    size = 'md',
    variant = 'primary',
    className = ''
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    };

    const colors = {
        primary: 'text-primary-500',
        secondary: 'text-secondary-500',
        white: 'text-white'
    };

    const classes = `animate-spin ${sizes[size]} ${colors[variant]} ${className}`;

    return (
        <svg className={classes} fill="none" viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
};

// Skeleton loader for content
export const Skeleton = ({ className = '', lines = 1 }) => {
    return (
        <div className={`animate-pulse ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className="h-4 bg-secondary-200 rounded mb-2 last:mb-0"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                />
            ))}
        </div>
    );
};

// Skeleton for question cards
export const QuestionCardSkeleton = () => {
    return (
        <div className="card p-6 animate-pulse">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-secondary-200 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="h-5 bg-secondary-200 rounded mb-2" style={{ width: '80%' }} />
                    <div className="h-4 bg-secondary-200 rounded mb-1" style={{ width: '60%' }} />
                    <div className="h-4 bg-secondary-200 rounded mb-3" style={{ width: '70%' }} />
                    <div className="flex items-center space-x-4">
                        <div className="h-3 bg-secondary-200 rounded" style={{ width: '40px' }} />
                        <div className="h-3 bg-secondary-200 rounded" style={{ width: '60px' }} />
                        <div className="h-3 bg-secondary-200 rounded" style={{ width: '50px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner; 