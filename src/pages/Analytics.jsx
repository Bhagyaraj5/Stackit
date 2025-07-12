import React from 'react';
import { useAuth } from '../context/AuthContext';
import CommunityAnalytics from '../components/Analytics/CommunityAnalytics';
import Button from '../components/UI/Button';

const Analytics = () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                    Please sign in to view analytics
                </h1>
                <Button variant="primary" onClick={() => window.location.href = '/auth'}>
                    Sign In
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                    Community Analytics
                </h1>
                <p className="text-secondary-600">
                    Real-time insights into community engagement and trends
                </p>
            </div>

            {/* Analytics Dashboard */}
            <CommunityAnalytics />
        </div>
    );
};

export default Analytics; 