import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    User,
    MessageSquare,
    ThumbsUp,
    Award,
    Calendar,
    Settings
} from 'lucide-react';
import Button from '../components/UI/Button';
import EditProfileModal from '../components/Common/EditProfileModal';
import AchievementSystem from '../components/Gamification/AchievementSystem';
import { supabase, TABLES } from '../lib/supabase';
import { questions as mockQuestions, users as mockUsers } from '../utils/mockData';

const Dashboard = () => {
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stats, setStats] = useState({ questions: 0, answers: 0, accepted: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchStats = async () => {
            if (isLoggedIn && user) {
                // Use real data for authenticated users
                // Questions asked
                const { data: questionsData, error: questionsError } = await supabase
                    .from(TABLES.QUESTIONS)
                    .select('id, title, created_at')
                    .eq('author_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                // Answers given
                const { count: answersCount, data: answersData } = await supabase
                    .from(TABLES.ANSWERS)
                    .select('id, is_accepted, question_id, created_at, updated_at, content', { count: 'exact' })
                    .eq('author_id', user.id);

                // Accepted answers
                const accepted = answersData ? answersData.filter(a => a.is_accepted).length : 0;

                setStats({
                    questions: questionsData ? questionsData.length : 0,
                    answers: answersCount || 0,
                    accepted
                });
                setRecentActivity(questionsData || []);
            } else {
                // Use mock data for non-authenticated users
                const mockUser = mockUsers[0]; // Use first mock user for demo
                const mockUserQuestions = mockQuestions.filter(q => q.author.id === mockUser.id);

                setStats({
                    questions: mockUserQuestions.length,
                    answers: 3, // Mock answer count
                    accepted: 2 // Mock accepted answers count
                });
                setRecentActivity(mockUserQuestions.map(q => ({
                    id: q.id,
                    title: q.title,
                    created_at: q.createdAt
                })));
            }
            setLoading(false);
        };
        fetchStats();
    }, [user, isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                        Demo Dashboard
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-300">
                        This is a preview of what your dashboard will look like when you sign in.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="card p-6">
                            <div className="text-center mb-6">
                                <img
                                    src={mockUsers[0].avatar}
                                    alt={mockUsers[0].username}
                                    className="w-24 h-24 rounded-full mx-auto mb-4"
                                />
                                <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                                    {mockUsers[0].username}
                                </h2>
                                <p className="text-secondary-600 dark:text-secondary-300">{mockUsers[0].email}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-600">Reputation</span>
                                    <span className="font-semibold text-secondary-900">
                                        {mockUsers[0].reputation}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary-600">Member since</span>
                                    <span className="font-semibold text-secondary-900">
                                        {new Date(mockUsers[0].joinedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => navigate('/auth')}
                                >
                                    Sign In to Access
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats and Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="card p-6 text-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                                    <MessageSquare className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{loading ? '-' : stats.questions}</h3>
                                <p className="text-secondary-600 dark:text-secondary-300">Questions Asked</p>
                            </div>

                            <div className="card p-6 text-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4">
                                    <ThumbsUp className="w-6 h-6 text-success-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{loading ? '-' : stats.answers}</h3>
                                <p className="text-secondary-600 dark:text-secondary-300">Answers Given</p>
                            </div>

                            <div className="card p-6 text-center">
                                <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4">
                                    <Award className="w-6 h-6 text-warning-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{loading ? '-' : stats.accepted}</h3>
                                <p className="text-secondary-600 dark:text-secondary-300">Accepted Answers</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                                Recent Activity
                            </h3>
                            {loading ? (
                                <div>Loading...</div>
                            ) : recentActivity.length === 0 ? (
                                <div className="text-secondary-500">Unlock your first question by posting one!</div>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivity.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                                <MessageSquare className="w-4 h-4 text-primary-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                                    Asked: {item.title}
                                                </p>
                                                <p className="text-xs text-secondary-500 dark:text-secondary-400">{new Date(item.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2 text-right">
                                        <Button variant="link" onClick={() => navigate('/auth')}>Sign In to View All</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="primary" className="w-full" onClick={() => navigate('/auth')}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Sign In to Ask
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => navigate('/auth')}>
                                    <User className="w-4 h-4 mr-2" />
                                    Sign In to View
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sign In Prompt */}
                <div className="mt-8 card p-6 text-center">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                        Ready to join the community?
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                        Sign in to ask questions, provide answers, and track your activity.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/auth')}>
                        Sign In Now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                    Dashboard
                </h1>
                <p className="text-secondary-600 dark:text-secondary-300">
                    Welcome back, {user.username}!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="card p-6">
                        <div className="text-center mb-6">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                            <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
                                {user.username}
                            </h2>
                            <p className="text-secondary-600 dark:text-secondary-300">{user.email}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-600">Reputation</span>
                                <span className="font-semibold text-secondary-900">
                                    {user.reputation}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-600">Member since</span>
                                <span className="font-semibold text-secondary-900">
                                    {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : 'No date'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats and Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                                <MessageSquare className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{loading ? '-' : stats.questions}</h3>
                            <p className="text-secondary-600 dark:text-secondary-300">Questions Asked</p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4">
                                <ThumbsUp className="w-6 h-6 text-success-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{loading ? '-' : stats.answers}</h3>
                            <p className="text-secondary-600 dark:text-secondary-300">Answers Given</p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4">
                                <Award className="w-6 h-6 text-warning-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-1">{loading ? '-' : stats.accepted}</h3>
                            <p className="text-secondary-600 dark:text-secondary-300">Accepted Answers</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                            Recent Activity
                        </h3>
                        {loading ? (
                            <div>Loading...</div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-secondary-500">Unlock your first question by posting one!</div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                                Asked: {item.title}
                                            </p>
                                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{new Date(item.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 text-right">
                                    <Button variant="link" onClick={() => navigate('/my-questions')}>View All</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="primary" className="w-full">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Ask a Question
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => navigate('/my-questions')}>
                                <User className="w-4 h-4 mr-2" />
                                View My Questions
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <div className="mt-8">
                <AchievementSystem user={user} />
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard; 