import React, { useState, useEffect } from 'react';
import { X, User, Mail, Camera, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';
import Input from '../UI/Input';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateProfile, uploadAvatar } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({});
            setAvatarPreview(null);
            setAvatarFile(null);
        }
    }, [isOpen, user]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
            setAvatarFile(file);
            setErrors(prev => ({ ...prev, avatar: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters long';
        } else if (formData.username.trim().length > 20) {
            newErrors.username = 'Username must be less than 20 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation (only if user wants to change password)
        if (formData.newPassword || formData.confirmPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to change password';
            }

            if (formData.newPassword && formData.newPassword.length < 6) {
                newErrors.newPassword = 'New password must be at least 6 characters long';
            }

            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
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
            const updates = {
                username: formData.username.trim(),
                email: formData.email.trim()
            };

            // Handle avatar upload first if there's a new file
            if (avatarFile) {
                const avatarResult = await uploadAvatar(avatarFile);
                if (!avatarResult.success) {
                    setErrors({ general: avatarResult.error });
                    setLoading(false);
                    return;
                }
            }

            // Update profile information
            const result = await updateProfile(updates);

            if (result.success) {
                // Show success message
                alert('Profile updated successfully!');
                setLoading(false);
                onClose();
            } else {
                setErrors({ general: result.error });
                setLoading(false);
            }
        } catch (error) {
            setErrors({ general: 'Failed to update profile. Please try again.' });
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-charcoal-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-charcoal-700">
                    <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-secondary-400 hover:text-secondary-600 dark:text-secondary-300 dark:hover:text-secondary-100 rounded-lg hover:bg-secondary-100 dark:hover:bg-charcoal-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* General Error */}
                    {errors.general && (
                        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                            <p className="text-sm text-danger-600">{errors.general}</p>
                        </div>
                    )}

                    {/* Avatar Section */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <img
                                src={avatarPreview || user.avatar}
                                alt={user.username}
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                            <label className="absolute bottom-4 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors">
                                <Camera className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {errors.avatar && (
                            <p className="text-sm text-danger-600 mt-1">{errors.avatar}</p>
                        )}
                        {avatarFile && (
                            <p className="text-sm text-success-600 mt-1">
                                New avatar selected: {avatarFile.name}
                            </p>
                        )}
                    </div>

                    {/* Username */}
                    <Input
                        label="Username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        error={errors.username}
                        leftIcon={<User className="w-4 h-4 text-secondary-400" />}
                    />

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

                    {/* Password Change Section */}
                    <div className="border-t border-secondary-200 pt-6">
                        <h3 className="text-lg font-medium text-secondary-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                            {/* Current Password */}
                            <Input
                                label="Current Password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter current password"
                                value={formData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                error={errors.currentPassword}
                                leftIcon={<Mail className="w-4 h-4 text-secondary-400" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="text-secondary-400 hover:text-secondary-600"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                            />

                            {/* New Password */}
                            <Input
                                label="New Password"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                error={errors.newPassword}
                                leftIcon={<Mail className="w-4 h-4 text-secondary-400" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-secondary-400 hover:text-secondary-600"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                            />

                            {/* Confirm Password */}
                            <Input
                                label="Confirm New Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                error={errors.confirmPassword}
                                leftIcon={<Mail className="w-4 h-4 text-secondary-400" />}
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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            className="flex-1"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal; 