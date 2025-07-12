# Supabase Setup Guide for StackIt

This guide will help you set up Supabase for your StackIt Q&A forum application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `stackit-forum` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
6. Click "Create new project"
7. Wait for the project to be ready (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your project root, create a `.env` file:
   ```bash
   # Copy the example file
   cp env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL

This will create:
- All necessary tables (users, questions, answers, etc.)
- Row Level Security policies
- Storage buckets for avatars and images
- Sample tags data

## Step 5: Verify Storage Setup

1. Go to **Storage** in your Supabase dashboard
2. You should see two buckets:
   - `avatars` - for user profile pictures
   - `question-images` - for question attachments
3. Both buckets should be public (this is set by the SQL script)

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Try to:
   - Sign up with a new account
   - Sign in with existing credentials
   - Upload a profile picture
   - Edit your profile

## Troubleshooting

### Common Issues

**"Missing Supabase environment variables" error**
- Make sure your `.env` file exists and has the correct variable names
- Restart your development server after creating the `.env` file

**"Invalid API key" error**
- Double-check your anon key in the `.env` file
- Make sure you copied the entire key (it should be very long)

**"Table doesn't exist" error**
- Make sure you ran the SQL script in the Supabase SQL Editor
- Check that all tables were created successfully

**Avatar upload fails**
- Verify that the `avatars` storage bucket exists
- Check that the bucket is public
- Ensure your user is authenticated

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com)
- Check the [StackIt README](./README.md) for more details

## Next Steps

Once Supabase is set up, you can:

1. **Customize the database schema** - Add new tables or modify existing ones
2. **Add more features** - Implement real-time notifications, email alerts, etc.
3. **Deploy to production** - Use Vercel, Netlify, or any hosting platform
4. **Set up custom domains** - Configure your own domain for Supabase

## Security Notes

- Never commit your `.env` file to version control
- The anon key is safe to use in the frontend (it has limited permissions)
- Row Level Security (RLS) policies protect your data
- Users can only access their own data and public content

---

Your StackIt forum is now ready with a real backend! 🚀 