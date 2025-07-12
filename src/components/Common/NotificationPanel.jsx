import React, { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, ThumbsUp, CheckCircle, AtSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NotificationPanel = () => {
    const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'answer':
                return <MessageSquare className="w-4 h-4 text-primary-500" />;
            case 'vote':
                return <ThumbsUp className="w-4 h-4 text-success-500" />;
            case 'accept':
                return <CheckCircle className="w-4 h-4 text-success-500" />;
            case 'mention':
                return <AtSign className="w-4 h-4 text-warning-500" />;
            default:
                return <Bell className="w-4 h-4 text-secondary-500" />;
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markNotificationAsRead(notification.id);
        }
        setIsOpen(false);
        // In a real app, you'd navigate to the relevant question/answer
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 z-50 animate-fade-in">
                    <div className="p-4 border-b border-secondary-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-secondary-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllNotificationsAsRead}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-secondary-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`
                    p-4 border-b border-secondary-100 last:border-b-0 cursor-pointer
                    transition-colors duration-200 hover:bg-secondary-50
                    ${!notification.read ? 'bg-primary-50' : ''}
                  `}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-secondary-900 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-secondary-500 mt-1">
                                                {formatTimeAgo(notification.timestamp)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-secondary-200">
                            <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPanel; 