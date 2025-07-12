import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    type = 'button',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md',
        secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus:ring-secondary-500 dark:bg-charcoal-800 dark:text-secondary-100 dark:hover:bg-charcoal-700',
        success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500',
        danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
        warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-300 dark:text-primary-300 dark:hover:bg-charcoal-800',
        ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500 dark:text-secondary-100 dark:hover:bg-charcoal-700'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button; 