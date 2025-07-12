import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { FcGoogle } from 'react-icons/fc';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';

const Auth = () => {
    const navigate = useNavigate();
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!isLogin && !formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (!isLogin && formData.username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }
        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                result = await signup(formData.username, formData.email, formData.password);
            }
            if (result.success) {
                navigate('/');
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setErrors({});
        try {
            // Import both authService and oauthDebug
            const { authService } = await import('../services/authService');
            const { oauthDebug } = await import('../utils/oauthDebug.js');

            console.log('Before config check');
            // Add a timeout fallback for config check
            const configPromise = oauthDebug.checkAllConfiguration();
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Config check timeout')), 7000));
            const configCheck = await Promise.race([configPromise, timeoutPromise]);
            console.log('After config check', configCheck);

            if (!configCheck.success) {
                console.error('OAuth configuration check failed:', configCheck);
                const errorMessages = Object.entries(configCheck.results)
                    .filter(([key, result]) => !result.success)
                    .map(([key, result]) => `${key}: ${result.error || 'Check failed'}`)
                    .join(', ');
                setErrors({ general: `Configuration error: ${errorMessages}` });
                return;
            }

            console.log('About to call signInWithGoogle');
            const result = await authService.signInWithGoogle();
            console.log('signInWithGoogle result:', result);

            if (!result.success) {
                console.error('Google sign-in failed:', result.error);
                setErrors({ general: result.error });
            } else {
                console.log('Google sign-in initiated successfully');
                // The redirect will handle the rest
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            setErrors({ general: 'Google sign-in failed. Please try again.' });
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGuestMode = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                        {isLogin ? 'Sign in to StackIt' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-300">
                        {isLogin ? 'Welcome back! Please sign in to your account.' : 'Join our community of developers.'}
                    </p>
                </div>
                {/* Google Sign In Button */}
                <div className="card p-4 flex flex-col items-center mb-4 bg-white dark:bg-charcoal-800">
                    <GoogleSignInButton />
                    <div className="w-full border-t border-secondary-200 dark:border-charcoal-700 my-2" />
                    <span className="text-xs text-secondary-400 dark:text-secondary-500">or</span>
                </div>
                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                                <p className="text-sm text-danger-600">{errors.general}</p>
                            </div>
                        )}
                        {/* Username (Signup only) */}
                        {!isLogin && (
                            <Input
                                label="Username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                error={errors.username}
                                leftIcon={<User className="w-4 h-4 text-secondary-400" />}
                            />
                        )}
                        {/* Email */}
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            error={errors.email}
                            leftIcon={<Mail className="w-4 h-4 text-secondary-400" />}
                        />
                        {/* Password */}
                        <div>
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                error={errors.password}
                                leftIcon={<Lock className="w-4 h-4 text-secondary-400" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-secondary-400 hover:text-secondary-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                            />
                        </div>
                        {/* Confirm Password (Signup only) */}
                        {!isLogin && (
                            <div>
                                <Input
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    error={errors.confirmPassword}
                                    leftIcon={<Lock className="w-4 h-4 text-secondary-400" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-secondary-400 hover:text-secondary-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                />
                            </div>
                        )}
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            className="text-primary-600 hover:underline text-sm"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                        <button
                            type="button"
                            className="text-secondary-500 hover:underline text-sm"
                            onClick={handleGuestMode}
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth; 