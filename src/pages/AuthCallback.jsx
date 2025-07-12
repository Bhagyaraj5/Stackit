import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
    const [status, setStatus] = useState('Processing...');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (data.session) {
                    setStatus('Sign-in successful! Redirecting...');
                    setTimeout(() => navigate('/'), 1000);
                } else {
                    throw new Error('No session found after OAuth callback');
                }
            } catch (err) {
                setError(err.message || 'Sign-in failed');
                setStatus('Sign-in failed');
            }
        };
        handleCallback();
    }, [navigate]);

    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>
                <h2>Sign-in Failed</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/auth')}>Try Again</button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
            <h2>Completing Sign-in</h2>
            <p>{status}</p>
        </div>
    );
};

export default AuthCallback; 