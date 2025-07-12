import React, { useState, useEffect } from 'react';
import { Users, Eye, Edit, MessageCircle } from 'lucide-react';

const LiveCollaboration = ({ questionId, currentUser }) => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Simulate real-time user activity
        const mockUsers = [
            { id: 1, username: 'alex_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', action: 'viewing' },
            { id: 2, username: 'sarah_coder', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face', action: 'typing' },
            { id: 3, username: 'mike_tech', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', action: 'viewing' }
        ];

        setActiveUsers(mockUsers);

        // Simulate typing indicator
        const typingInterval = setInterval(() => {
            setIsTyping(prev => !prev);
        }, 3000);

        return () => clearInterval(typingInterval);
    }, [questionId]);

    const getActionIcon = (action) => {
        switch (action) {
            case 'typing':
                return <Edit className="w-3 h-3 text-blue-500" />;
            case 'viewing':
                return <Eye className="w-3 h-3 text-gray-500" />;
            default:
                return <MessageCircle className="w-3 h-3 text-green-500" />;
        }
    };

    const getActionText = (action) => {
        switch (action) {
            case 'typing':
                return 'typing...';
            case 'viewing':
                return 'viewing';
            default:
                return 'online';
        }
    };

    return (
        <div className="card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-charcoal-800 dark:bg-none border border-blue-200 dark:border-charcoal-700">
            <div className="flex items-center space-x-2 mb-3">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                <h4 className="text-sm font-medium text-gray-900 dark:text-secondary-100">Live Activity</h4>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                    {activeUsers.length} active
                </span>
            </div>

            <div className="space-y-2">
                {activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-6 h-6 rounded-full"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-charcoal-800 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 dark:text-secondary-100 truncate">
                                {user.username}
                            </p>
                            <div className="flex items-center space-x-1">
                                {getActionIcon(user.action)}
                                <span className="text-xs text-gray-500 dark:text-secondary-400">
                                    {getActionText(user.action)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isTyping && (
                <div className="mt-3 p-2 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-600">Someone is typing...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveCollaboration; 