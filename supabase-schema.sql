-- Enable Row Level Security

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    reputation INTEGER DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    votes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    is_answered BOOLEAN DEFAULT FALSE,
    accepted_answer_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create question_tags junction table
CREATE TABLE IF NOT EXISTS public.question_tags (
    question_id INTEGER REFERENCES public.questions(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);

-- Create answers table
CREATE TABLE IF NOT EXISTS public.answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'answer', 'vote', 'accept', 'mention'
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    question_id INTEGER REFERENCES public.questions(id) ON DELETE SET NULL,
    answer_id INTEGER REFERENCES public.answers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_author_id ON public.questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at);
CREATE INDEX IF NOT EXISTS idx_questions_votes ON public.questions(votes);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_author_id ON public.answers(author_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON public.answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for questions table
CREATE POLICY "Anyone can view questions" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create questions" ON public.questions
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own questions" ON public.questions
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own questions" ON public.questions
    FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for answers table
CREATE POLICY "Anyone can view answers" ON public.answers
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create answers" ON public.answers
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own answers" ON public.answers
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own answers" ON public.answers
    FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- RLS Policies for tags table
CREATE POLICY "Anyone can view tags" ON public.tags
    FOR SELECT USING (true);

-- RLS Policies for question_tags table
CREATE POLICY "Anyone can view question tags" ON public.question_tags
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create question tags" ON public.question_tags
    FOR INSERT WITH CHECK (true);

-- Insert some default tags
INSERT INTO public.tags (name, description, color) VALUES
    ('React', 'React.js framework and ecosystem', '#61DAFB'),
    ('JavaScript', 'JavaScript programming language', '#F7DF1E'),
    ('TypeScript', 'TypeScript programming language', '#3178C6'),
    ('Node.js', 'Node.js runtime environment', '#339933'),
    ('Express', 'Express.js web framework', '#000000'),
    ('API', 'Application Programming Interfaces', '#3B82F6'),
    ('Performance', 'Performance optimization', '#F59E0B'),
    ('CSS', 'Cascading Style Sheets', '#1572B6'),
    ('Tailwind CSS', 'Tailwind CSS framework', '#06B6D4'),
    ('Dark Mode', 'Dark mode implementation', '#6366F1'),
    ('Async', 'Asynchronous programming', '#F59E0B'),
    ('Promises', 'JavaScript Promises', '#F59E0B'),
    ('ES6', 'ECMAScript 2015+ features', '#F59E0B'),
    ('Error Handling', 'Error handling and debugging', '#EF4444'),
    ('Programming', 'General programming topics', '#3B82F6'),
    ('Hooks', 'React Hooks', '#61DAFB')
ON CONFLICT (name) DO NOTHING;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
    ('avatars', 'avatars', true),
    ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own avatars" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for question-images bucket
CREATE POLICY "Anyone can view question images" ON storage.objects
    FOR SELECT USING (bucket_id = 'question-images');

CREATE POLICY "Authenticated users can upload question images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'question-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own question images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'question-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own question images" ON storage.objects
    FOR DELETE USING (bucket_id = 'question-images' AND auth.uid()::text = (storage.foldername(name))[1]); 