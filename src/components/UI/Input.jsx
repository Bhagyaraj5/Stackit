import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}, ref) => {
    const baseClasses = 'w-full px-3 py-2 border-2 border-secondary-200 rounded-md focus:outline-none focus:border-primary-500 transition-colors duration-200 bg-white dark:bg-charcoal-800 dark:border-charcoal-700 dark:text-secondary-100';
    const errorClasses = error ? 'border-danger-500 focus:border-danger-500' : '';
    const iconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    const classes = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={classes}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {rightIcon}
                    </div>
                )}
            </div>
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-danger-600' : 'text-secondary-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input; 