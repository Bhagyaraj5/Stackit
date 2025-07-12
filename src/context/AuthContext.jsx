import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNotifications, setUserNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from Supabase
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const result = await authService.getCurrentUser();
                if (result.success && result.user) {
                    setUser(result.user);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen to auth state changes
        const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const result = await authService.getCurrentUser();
                if (result.success && result.user) {
                    setUser(result.user);
                    setIsLoggedIn(true);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setIsLoggedIn(false);
                setUserNotifications([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const result = await authService.signIn(email, password);

        if (result.success) {
            setUser(result.user);
            setIsLoggedIn(true);
            return { success: true, user: result.user };
        }

        return { success: false, error: result.error };
    };

    const signup = async (username, email, password) => {
        const result = await authService.signUp(email, password, username);

        if (result.success) {
            setUser(result.user);
            setIsLoggedIn(true);
            return { success: true, user: result.user };
        }

        return { success: false, error: result.error };
    };

    const logout = async () => {
        const result = await authService.signOut();

        if (result.success) {
            setUser(null);
            setIsLoggedIn(false);
            setUserNotifications([]);
        }
    };

    const updateProfile = async (updatedUserData) => {
        if (!user?.id) return { success: false, error: 'User not found' };

        const result = await authService.updateProfile(user.id, updatedUserData);

        if (result.success) {
            setUser(prev => ({ ...prev, ...result.user }));
            return { success: true, user: result.user };
        }

        return { success: false, error: result.error };
    };

    const uploadAvatar = async (file) => {
        if (!user?.id) return { success: false, error: 'User not found' };

        const result = await authService.uploadAvatar(user.id, file);

        if (result.success) {
            // Update user with new avatar URL
            const updateResult = await updateProfile({ avatar: result.url });
            return updateResult;
        }

        return { success: false, error: result.error };
    };

    const markNotificationAsRead = (notificationId) => {
        setUserNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId
                    ? { ...notif, read: true }
                    : notif
            )
        );
    };

    const markAllNotificationsAsRead = () => {
        setUserNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const addNotification = (notification) => {
        setUserNotifications(prev => [notification, ...prev]);
    };

    const getUnreadCount = () => {
        return userNotifications.filter(n => !n.read).length;
    };

    const value = {
        user,
        isLoggedIn,
        loading,
        notifications: userNotifications,
        unreadCount: getUnreadCount(),
        login,
        signup,
        logout,
        updateProfile,
        uploadAvatar,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 