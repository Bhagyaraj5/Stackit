# Google OAuth Setup Guide for StackIt

This guide will help you set up Google OAuth authentication for your StackIt application.

## Prerequisites

1. A Supabase project (see `SUPABASE_SETUP.md`)
2. A Google Cloud Console project
3. Your application running locally (typically on `http://localhost:3000`)

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 1.2 Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: StackIt (or your preferred name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email) if in testing mode
6. Save and continue

### 1.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set the following:
   - **Name**: StackIt Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://your-domain.com/auth/callback` (for production)
5. Click **Create**
6. **Save the Client ID and Client Secret** (you'll need these for Supabase)

## Step 2: Supabase Configuration

### 2.1 Configure Google OAuth in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Edit**
4. Enable Google OAuth by toggling the switch
5. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Set the **Redirect URL** to: `https://your-project-id.supabase.co/auth/v1/callback`
7. Save the configuration

### 2.2 Configure Site URL

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Set **Site URL** to your application URL:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
4. Save the settings

## Step 3: Environment Variables

### 3.1 Create .env File

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Google Gemini API key for AI features
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3.2 Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key
3. Paste them in your `.env` file

## Step 4: Testing the Setup

### 4.1 Start Your Application

```bash
npm run dev
```

### 4.2 Test Google Sign-in

1. Open your application in the browser
2. Go to the sign-in page
3. Click "Continue with Google"
4. You should be redirected to Google's consent screen
5. After consenting, you should be redirected back to your app

### 4.3 Check Console for Debug Information

Open the browser's developer console to see detailed logs:
- OAuth configuration checks
- Sign-in process steps
- Any errors that occur

## Troubleshooting

### Common Issues

**"Configuration error: Missing Supabase environment variables"**
- Make sure your `.env` file exists and has the correct variable names
- Restart your development server after creating the `.env` file

**"Google sign-in failed"**
- Check that Google OAuth is enabled in Supabase
- Verify your Client ID and Client Secret are correct
- Ensure redirect URLs match exactly

**"Redirect URI mismatch"**
- Make sure the redirect URI in Google Cloud Console matches your Supabase redirect URL
- Check that your site URL is configured correctly in Supabase

**"OAuth consent screen not configured"**
- Complete the OAuth consent screen setup in Google Cloud Console
- Add your email as a test user if in testing mode

### Debug Steps

1. **Check Environment Variables**:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

2. **Test Supabase Connection**:
   ```javascript
   const { data, error } = await supabase.auth.getSession();
   console.log('Supabase connection:', { data, error });
   ```

3. **Check OAuth Configuration**:
   - Verify Google provider is enabled in Supabase
   - Check that Client ID and Secret are set correctly
   - Ensure redirect URLs are properly configured

### Production Deployment

When deploying to production:

1. Update Google Cloud Console with your production domain
2. Update Supabase site URL and redirect URLs
3. Set up proper environment variables in your hosting platform
4. Test the OAuth flow in production

## Security Notes

- Never commit your `.env` file to version control
- Keep your Google OAuth Client Secret secure
- Use HTTPS in production
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Cloud Console

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Providers](https://supabase.com/docs/guides/auth/auth-providers)

---

Your Google OAuth setup should now be working! 🚀 