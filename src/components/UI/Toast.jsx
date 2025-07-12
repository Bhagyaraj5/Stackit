import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({
    message,
    type = 'info',
    duration = 5000,
    onClose,
    id
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-success-500" />,
        error: <AlertCircle className="w-5 h-5 text-danger-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-warning-500" />,
        info: <Info className="w-5 h-5 text-primary-500" />
    };

    const colors = {
        success: 'bg-success-50 border-success-200 text-success-800',
        error: 'bg-danger-50 border-danger-200 text-danger-800',
        warning: 'bg-warning-50 border-warning-200 text-warning-800',
        info: 'bg-primary-50 border-primary-200 text-primary-800'
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
        >
            <div className={`
        flex items-start p-4 rounded-lg border shadow-lg
        ${colors[type]}
      `}>
                <div className="flex-shrink-0 mr-3 mt-0.5">
                    {icons[type]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-3 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Toast Container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast; 