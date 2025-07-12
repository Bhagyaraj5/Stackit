import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
    USERS: 'users',
    QUESTIONS: 'questions',
    ANSWERS: 'answers',
    NOTIFICATIONS: 'notifications',
    TAGS: 'tags',
    QUESTION_TAGS: 'question_tags'
}

// Storage bucket names
export const STORAGE_BUCKETS = {
    AVATARS: 'avatars',
    QUESTION_IMAGES: 'question-images'
} 