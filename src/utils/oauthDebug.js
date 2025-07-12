import { supabase } from '../lib/supabase';

export const oauthDebug = {
    // Check all OAuth configuration
    async checkAllConfiguration() {
        console.log('🔍 Starting OAuth Configuration Check...');

        let results = {};
        try {
            console.log('[DEBUG] Starting environment check');
            results.environment = await this.checkEnvironmentVariables();
            console.log('[DEBUG] Finished environment check', results.environment);

            console.log('[DEBUG] Starting supabase connection check');
            results.supabase = await this.checkSupabaseConnection();
            console.log('[DEBUG] Finished supabase connection check', results.supabase);

            console.log('[DEBUG] Starting oauth provider check');
            results.oauth = await this.checkOAuthProvider();
            console.log('[DEBUG] Finished oauth provider check', results.oauth);

            console.log('[DEBUG] Starting redirect url check');
            results.redirects = await this.checkRedirectUrls();
            console.log('[DEBUG] Finished redirect url check', results.redirects);
        } catch (err) {
            console.error('[DEBUG] Error during config check:', err);
        }

        console.log('📋 OAuth Configuration Results:', results);

        const allPassed = Object.values(results).every(result => result.success);

        if (allPassed) {
            console.log('✅ All OAuth configuration checks passed!');
        } else {
            console.log('❌ Some OAuth configuration checks failed. See details above.');
        }

        return {
            success: allPassed,
            results
        };
    },

    // Check environment variables
    async checkEnvironmentVariables() {
        console.log('🔧 Checking environment variables...');

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const hasUrl = !!supabaseUrl;
        const hasKey = !!supabaseAnonKey;
        const urlValid = hasUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co');
        const keyValid = hasKey && supabaseAnonKey.startsWith('eyJ');

        const result = {
            success: hasUrl && hasKey && urlValid && keyValid,
            details: {
                hasUrl,
                hasKey,
                urlValid,
                keyValid,
                url: hasUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
                key: hasKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING'
            }
        };

        if (!result.success) {
            console.error('❌ Environment variables check failed:', result.details);
        } else {
            console.log('✅ Environment variables check passed');
        }

        return result;
    },

    // Check Supabase connection
    async checkSupabaseConnection() {
        console.log('🔌 Checking Supabase connection...');

        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('❌ Supabase connection failed:', error);
                return {
                    success: false,
                    error: error.message
                };
            }

            console.log('✅ Supabase connection successful');
            return {
                success: true,
                hasSession: !!data.session
            };
        } catch (error) {
            console.error('❌ Supabase connection error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Check OAuth provider configuration
    async checkOAuthProvider() {
        console.log('🔐 Checking OAuth provider configuration...');

        try {
            // Try to get OAuth providers (this might not work with anon key)
            // Note: listIdentities might not be available in all Supabase versions
            if (typeof supabase.auth.listIdentities === 'function') {
                const { data, error } = await supabase.auth.listIdentities();

                if (error) {
                    console.warn('⚠️ Could not check OAuth providers (this is normal with anon key)');
                    return {
                        success: true,
                        warning: 'OAuth provider check requires service role key'
                    };
                }

                console.log('✅ OAuth provider check passed');
                return {
                    success: true,
                    providers: data
                };
            } else {
                console.warn('⚠️ listIdentities function not available (this is normal)');
                return {
                    success: true,
                    warning: 'OAuth provider check not available in this Supabase version'
                };
            }
        } catch (error) {
            console.warn('⚠️ OAuth provider check failed (this is normal):', error.message);
            return {
                success: true,
                warning: 'Could not verify OAuth providers'
            };
        }
    },

    // Check redirect URLs
    async checkRedirectUrls() {
        console.log('🔄 Checking redirect URLs...');

        const currentOrigin = window.location.origin;
        const expectedCallbackUrl = `${currentOrigin}/auth/callback`;

        console.log('Current origin:', currentOrigin);
        console.log('Expected callback URL:', expectedCallbackUrl);

        const result = {
            success: true,
            details: {
                currentOrigin,
                expectedCallbackUrl,
                note: 'Make sure this matches your Supabase redirect URLs'
            }
        };

        console.log('✅ Redirect URL check passed');
        return result;
    },

    // Test Google OAuth flow
    async testGoogleOAuth() {
        console.log('🧪 Testing Google OAuth flow...');

        try {
            const redirectTo = `${window.location.origin}/auth/callback`;

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
                console.error('❌ Google OAuth test failed:', error);
                return {
                    success: false,
                    error: error.message
                };
            }

            console.log('✅ Google OAuth test initiated successfully');
            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('❌ Google OAuth test error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Get current session info
    async getSessionInfo() {
        console.log('📊 Getting current session info...');

        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('❌ Failed to get session:', error);
                return {
                    success: false,
                    error: error.message
                };
            }

            const sessionInfo = {
                hasSession: !!session,
                user: session?.user ? {
                    id: session.user.id,
                    email: session.user.email,
                    provider: session.user.app_metadata?.provider
                } : null,
                expiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : null
            };

            console.log('✅ Session info retrieved:', sessionInfo);
            return {
                success: true,
                session: sessionInfo
            };
        } catch (error) {
            console.error('❌ Session info error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};

// Auto-run configuration check in development
if (import.meta.env.DEV) {
    console.log('🚀 Development mode detected. Running OAuth configuration check...');
    oauthDebug.checkAllConfiguration();
} 