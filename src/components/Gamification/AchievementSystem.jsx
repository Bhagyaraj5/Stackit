import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap, Heart, MessageSquare, ThumbsUp, Award } from 'lucide-react';

const ACHIEVEMENTS = [
    {
        id: 1,
        name: 'First Question',
        description: 'Ask your first question',
        icon: MessageSquare,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        unlockCheck: (stats) => stats.questions > 0,
        unlockDate: (stats) => stats.firstQuestionDate,
    },
    {
        id: 2,
        name: 'Helpful Answer',
        description: 'Receive 10 upvotes on an answer',
        icon: ThumbsUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        unlockCheck: (stats) => stats.answerUpvotes >= 10,
        unlockDate: (stats) => stats.firstHelpfulAnswerDate,
    },
    {
        id: 3,
        name: 'Accepted Answer',
        description: 'Have an answer accepted as the best',
        icon: Award,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        unlockCheck: (stats) => stats.accepted > 0,
        unlockDate: (stats) => stats.firstAcceptedDate,
    },
    {
        id: 4,
        name: 'Community Pillar',
        description: 'Reach 1000 reputation points',
        icon: Trophy,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        unlockCheck: (stats) => stats.reputation >= 1000,
        unlockDate: (stats) => stats.reputationDate,
    },
    {
        id: 5,
        name: 'Speed Demon',
        description: 'Answer 5 questions within 24 hours',
        icon: Zap,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        unlockCheck: (stats) => false, // Not implemented
        unlockDate: () => null,
    },
];

const AchievementSystem = ({ user, stats = {} }) => {
    // Use real reputation if available
    const reputation = user?.reputation || 0;
    const level = Math.floor(reputation / 100) + 1;

    const getLevelProgress = () => {
        const pointsForCurrentLevel = (level - 1) * 100;
        const pointsForNextLevel = level * 100;
        const progress = ((reputation - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
        return Math.min(progress, 100);
    };

    const getReputationBadge = () => {
        if (reputation >= 1000) return { name: 'Legend', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        if (reputation >= 500) return { name: 'Expert', color: 'text-purple-600', bgColor: 'bg-purple-100' };
        if (reputation >= 100) return { name: 'Helper', color: 'text-green-600', bgColor: 'bg-green-100' };
        return { name: 'Newcomer', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    };

    const reputationBadge = getReputationBadge();

    return (
        <div className="space-y-6">
            {/* Reputation Overview */}
            <div className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:bg-charcoal-800 dark:bg-none">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-100">Reputation & Level</h3>
                        <p className="text-sm text-gray-600 dark:text-secondary-300">Track your progress and achievements</p>
                    </div>
                    <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${reputationBadge.bgColor} ${reputationBadge.color}`}>
                            <Star className="w-4 h-4 mr-1" />
                            {reputationBadge.name}
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Level {level}</span>
                        <span className="text-sm text-gray-500">{reputation} / {level * 100} points</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getLevelProgress()}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-700">{reputation} reputation</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-700">Level {level}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Achievements */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACHIEVEMENTS.map((achievement) => {
                        const IconComponent = achievement.icon;
                        const unlocked = achievement.unlockCheck({
                            questions: stats.questions || 0,
                            accepted: stats.accepted || 0,
                            answerUpvotes: stats.answerUpvotes || 0,
                            reputation: reputation,
                            firstQuestionDate: stats.firstQuestionDate,
                            firstAcceptedDate: stats.firstAcceptedDate,
                            firstHelpfulAnswerDate: stats.firstHelpfulAnswerDate,
                            reputationDate: stats.reputationDate,
                        });
                        const unlockDate = achievement.unlockDate({
                            questions: stats.questions || 0,
                            accepted: stats.accepted || 0,
                            answerUpvotes: stats.answerUpvotes || 0,
                            reputation: reputation,
                            firstQuestionDate: stats.firstQuestionDate,
                            firstAcceptedDate: stats.firstAcceptedDate,
                            firstHelpfulAnswerDate: stats.firstHelpfulAnswerDate,
                            reputationDate: stats.reputationDate,
                        });
                        return (
                            <div
                                key={achievement.id}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${unlocked
                                    ? `${achievement.bgColor} border-transparent dark:bg-charcoal-800 dark:text-secondary-100`
                                    : 'bg-secondary-100 dark:bg-charcoal-800 border-secondary-200 dark:border-charcoal-700 opacity-60 dark:text-secondary-400'
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${unlocked ? achievement.bgColor : 'bg-secondary-200 dark:bg-charcoal-700'}`}>
                                        <IconComponent className={`w-5 h-5 ${unlocked ? achievement.color : 'text-secondary-400 dark:text-secondary-500'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-medium ${unlocked ? 'text-secondary-900 dark:text-secondary-100' : 'text-secondary-500 dark:text-secondary-400'}`}>
                                            {achievement.name}
                                        </h4>
                                        <p className={`text-sm ${unlocked ? 'text-secondary-700 dark:text-secondary-200' : 'text-secondary-400 dark:text-secondary-500'}`}>
                                            {achievement.description}
                                        </p>
                                        {unlocked && unlockDate && (
                                            <p className="text-xs text-secondary-500 dark:text-secondary-300 mt-1">
                                                Unlocked {new Date(unlockDate).toLocaleDateString()}
                                            </p>
                                        )}
                                        {!unlocked && (
                                            <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">Locked - {achievement.description}</p>
                                        )}
                                    </div>
                                    {unlocked && (
                                        <div className="text-green-500 dark:text-green-400">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AchievementSystem; 