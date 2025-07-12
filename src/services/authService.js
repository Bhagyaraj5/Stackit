import { supabase } from '../lib/supabase'

export const authService = {
    // Sign up with email and password
    async signUp(email, password, username) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            });
            if (error) throw error;
            // Create user profile in our users table
            if (data.user) {
                await authService.ensureUserProfile(data.user, username, email);
            }
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            let user = data.user;
            // Get or create user profile
            const profile = await authService.getOrCreateUserProfile(user);
            if (!profile.success) throw new Error(profile.error);
            user = { ...user, ...profile.user };
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Enhanced Sign in with Google OAuth
    async signInWithGoogle() {
        try {
            console.log('Starting Google OAuth sign-in...');

            // Check if Supabase is properly configured
            if (!supabase.auth) {
                throw new Error('Supabase auth is not properly initialized');
            }

            // Configure OAuth with proper redirect URL
            const redirectTo = `${window.location.origin}/auth/callback`;
            console.log('Redirect URL:', redirectTo);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectTo,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                console.error('Google OAuth error:', error);
                throw error;
            }

            console.log('Google OAuth initiated successfully:', data);

            // The redirect will handle the rest
            return { success: true, data };
        } catch (error) {
            console.error('Google OAuth sign-in failed:', error);
            return {
                success: false,
                error: error.message || 'Google sign-in failed. Please check your configuration.'
            };
        }
    },

    // Handle OAuth callback
    async handleOAuthCallback() {
        try {
            console.log('Handling OAuth callback...');

            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('OAuth callback error:', error);
                throw error;
            }

            if (data.session) {
                console.log('OAuth callback successful, user signed in:', data.session.user);

                // Get or create user profile
                const profile = await authService.getOrCreateUserProfile(data.session.user);
                if (!profile.success) {
                    console.error('Failed to get/create user profile:', profile.error);
                    throw new Error(profile.error);
                }

                return {
                    success: true,
                    user: { ...data.session.user, ...profile.user }
                };
            } else {
                throw new Error('No session found after OAuth callback');
            }
        } catch (error) {
            console.error('OAuth callback handling failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Check OAuth configuration
    async checkOAuthConfiguration() {
        try {
            console.log('Checking OAuth configuration...');

            // Check if environment variables are set
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                throw new Error('Missing Supabase environment variables');
            }

            console.log('Environment variables check passed');

            // Test Supabase connection
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Supabase connection test failed:', error);
                throw error;
            }

            console.log('Supabase connection test passed');

            return { success: true, message: 'OAuth configuration is valid' };
        } catch (error) {
            console.error('OAuth configuration check failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Get or create user profile
    async getOrCreateUserProfile(user) {
        try {
            // Try to get user profile
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
            if (profile) return { success: true, user: profile };
            // If not found, create it
            const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
            const { error: upsertError } = await supabase
                .from('users')
                .upsert([
                    {
                        id: user.id,
                        username,
                        email: user.email,
                        avatar: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${username}`,
                        reputation: 0,
                        joined_at: new Date().toISOString()
                    }
                ]);
            if (upsertError) throw upsertError;
            // Fetch the new profile
            const { data: newProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
            return { success: true, user: newProfile };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Ensure user profile exists (for sign up)
    async ensureUserProfile(user, username, email) {
        try {
            const { data: profile } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();
            if (!profile) {
                await supabase
                    .from('users')
                    .upsert([
                        {
                            id: user.id,
                            username,
                            email,
                            avatar: `https://ui-avatars.com/api/?name=${username}`,
                            reputation: 0,
                            joined_at: new Date().toISOString()
                        }
                    ]);
            }
        } catch (error) {
            // Ignore errors here
        }
    },

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            if (user) {
                const profile = await authService.getOrCreateUserProfile(user);
                if (!profile.success) throw new Error(profile.error);
                return { success: true, user: { ...user, ...profile.user } };
            }
            return { success: true, user: null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update user profile
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();
            if (error) throw error;
            return { success: true, user: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Upload avatar
    async uploadAvatar(userId, file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(fileName, file);
            if (error) throw error;
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
            return { success: true, url: publicUrl };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Listen to auth changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
} 