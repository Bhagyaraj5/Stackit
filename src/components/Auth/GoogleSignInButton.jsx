import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const GoogleSignInButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) throw error;
            // The redirect will happen automatically
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 text-gray-800 dark:text-secondary-100 font-semibold shadow-sm hover:shadow-md transition-all duration-150 hover:bg-gray-50 dark:hover:bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {/* Google Logo SVG */}
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_17_40)">
                        <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.4C36.7 32.2 34.7 34.7 31.8 36.4V42.1H39.3C44 38 47.5 31.9 47.5 24.5Z" fill="#4285F4" />
                        <path d="M24 48C30.6 48 36.1 45.9 39.3 42.1L31.8 36.4C30.1 37.5 27.9 38.2 24 38.2C17.7 38.2 12.2 34.1 10.3 28.7H2.5V34.6C5.7 41.1 14.1 48 24 48Z" fill="#34A853" />
                        <path d="M10.3 28.7C9.8 27.6 9.5 26.4 9.5 25.2C9.5 24 9.8 22.8 10.3 21.7V15.8H2.5C0.8 19.1 0 22.5 0 25.2C0 27.9 0.8 31.3 2.5 34.6L10.3 28.7Z" fill="#FBBC05" />
                        <path d="M24 9.8C27.7 9.8 30.2 11.3 31.5 12.5L39.4 5.1C36.1 2.1 30.6 0 24 0C14.1 0 5.7 6.9 2.5 15.8L10.3 21.7C12.2 16.3 17.7 9.8 24 9.8Z" fill="#EA4335" />
                    </g>
                    <defs>
                        <clipPath id="clip0_17_40">
                            <rect width="48" height="48" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                {loading ? 'Loading...' : 'Continue with Google'}
            </button>
            {error && <div className="text-danger-600 dark:text-danger-400 mt-2 text-sm">{error}</div>}
        </div>
    );
};

export default GoogleSignInButton; 