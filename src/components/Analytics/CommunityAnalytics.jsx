import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, Eye, BarChart3, Activity, Target } from 'lucide-react';

const CommunityAnalytics = () => {
    const [analytics, setAnalytics] = useState({});
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [userEngagement, setUserEngagement] = useState([]);

    useEffect(() => {
        // Mock analytics data
        setAnalytics({
            totalQuestions: 1247,
            totalAnswers: 3892,
            totalUsers: 892,
            totalViews: 45678,
            questionsThisWeek: 89,
            answersThisWeek: 234,
            newUsersThisWeek: 45,
            avgResponseTime: '2.3 hours'
        });

        setTrendingTopics([
            { name: 'React Performance', growth: '+23%', questions: 45, color: 'text-blue-600' },
            { name: 'TypeScript', growth: '+18%', questions: 38, color: 'text-purple-600' },
            { name: 'Next.js 14', growth: '+15%', questions: 32, color: 'text-green-600' },
            { name: 'Tailwind CSS', growth: '+12%', questions: 28, color: 'text-orange-600' },
            { name: 'Supabase', growth: '+8%', questions: 22, color: 'text-indigo-600' }
        ]);

        setUserEngagement([
            { day: 'Mon', questions: 12, answers: 34, users: 45 },
            { day: 'Tue', questions: 15, answers: 42, users: 52 },
            { day: 'Wed', questions: 18, answers: 38, users: 48 },
            { day: 'Thu', questions: 22, answers: 51, users: 61 },
            { day: 'Fri', questions: 19, answers: 47, users: 55 },
            { day: 'Sat', questions: 14, answers: 33, users: 42 },
            { day: 'Sun', questions: 11, answers: 29, users: 38 }
        ]);
    }, []);

    const getMaxValue = (data, key) => {
        return Math.max(...data.map(item => item[key]));
    };

    const getBarHeight = (value, maxValue) => {
        return (value / maxValue) * 100;
    };

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Total Questions</p>
                            <p className="text-2xl font-bold text-blue-900">{analytics.totalQuestions?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-blue-200 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-blue-700" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{analytics.questionsThisWeek} this week
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-r from-green-50 to-green-100 dark:bg-charcoal-800 dark:bg-none">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-300">Total Answers</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-200">{analytics.totalAnswers?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
                            <Target className="w-6 h-6 text-green-700 dark:text-green-300" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-300">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{analytics.answersThisWeek} this week
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:bg-charcoal-800 dark:bg-none">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Active Users</p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{analytics.totalUsers?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-lg">
                            <Users className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-purple-600 dark:text-purple-300">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{analytics.newUsersThisWeek} new this week
                    </div>
                </div>

                <div className="card p-6 bg-gradient-to-r from-orange-50 to-orange-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600">Total Views</p>
                            <p className="text-2xl font-bold text-orange-900">{analytics.totalViews?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-orange-200 rounded-lg">
                            <Eye className="w-6 h-6 text-orange-700" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-orange-600">
                        <Activity className="w-4 h-4 mr-1" />
                        Avg response: {analytics.avgResponseTime}
                    </div>
                </div>
            </div>

            {/* Trending Topics */}
            <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${topic.color.replace('text-', 'bg-')}`}></div>
                                <div>
                                    <p className="font-medium text-gray-900">{topic.name}</p>
                                    <p className="text-sm text-gray-600">{topic.questions} questions</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${topic.color}`}>{topic.growth}</p>
                                <p className="text-xs text-gray-500">this week</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Engagement Chart */}
            <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Engagement</h3>
                </div>
                <div className="flex items-end justify-between h-32 space-x-2">
                    {userEngagement.map((day, index) => {
                        const maxQuestions = getMaxValue(userEngagement, 'questions');
                        const maxAnswers = getMaxValue(userEngagement, 'answers');
                        const maxUsers = getMaxValue(userEngagement, 'users');

                        return (
                            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                                <div className="flex items-end space-x-1 w-full h-20">
                                    <div
                                        className="flex-1 bg-blue-500 rounded-t"
                                        style={{ height: `${getBarHeight(day.questions, maxQuestions)}%` }}
                                    ></div>
                                    <div
                                        className="flex-1 bg-green-500 rounded-t"
                                        style={{ height: `${getBarHeight(day.answers, maxAnswers)}%` }}
                                    ></div>
                                    <div
                                        className="flex-1 bg-purple-500 rounded-t"
                                        style={{ height: `${getBarHeight(day.users, maxUsers)}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-600">{day.day}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-gray-600">Questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-gray-600">Answers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span className="text-gray-600">Users</span>
                    </div>
                </div>
            </div>

            {/* Community Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Alex Developer', answers: 45, reputation: 1250 },
                            { name: 'Sarah Coder', answers: 38, reputation: 1100 },
                            { name: 'Mike Tech', answers: 32, reputation: 980 },
                            { name: 'Emma Builder', answers: 28, reputation: 850 },
                            { name: 'John Helper', answers: 25, reputation: 720 }
                        ].map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.answers} answers</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{user.reputation}</p>
                                    <p className="text-xs text-gray-500">reputation</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-100 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-charcoal-700 rounded-lg">
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">Questions Answered</span>
                            <span className="text-lg font-bold text-blue-900 dark:text-blue-200">89%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-charcoal-700 rounded-lg">
                            <span className="text-sm font-medium text-green-900 dark:text-green-200">Avg Response Time</span>
                            <span className="text-lg font-bold text-green-900 dark:text-green-200">2.3h</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-charcoal-700 rounded-lg">
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">User Satisfaction</span>
                            <span className="text-lg font-bold text-purple-900 dark:text-purple-200">4.8/5</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-charcoal-700 rounded-lg">
                            <span className="text-sm font-medium text-orange-900 dark:text-orange-200">Active Discussions</span>
                            <span className="text-lg font-bold text-orange-900 dark:text-orange-200">156</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityAnalytics; 