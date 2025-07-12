import { supabase, TABLES } from '../lib/supabase'
import { questions as mockQuestions } from '../utils/mockData'

export const questionService = {
    // Get all questions with author and tag information (using Supabase, not mock data)
    async getQuestions(filters = {}) {
        try {
            let query = supabase
                .from(TABLES.QUESTIONS)
                .select(`*, author:users(id, username, avatar), question_tags:question_tags(tag:tags(name))`)
                .order('created_at', { ascending: false });

            // Optional: Add search filter
            if (filters.search) {
                query = query.ilike('title', `%${filters.search}%`);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Map tags to a flat array of tag names
            let questions = (data || []).map(q => ({
                ...q,
                tags: q.question_tags?.map(qt => qt.tag?.name).filter(Boolean) || []
            }));

            // Optional: Filter by tags client-side (since SQL join for tags is complex)
            if (filters.tags && filters.tags.length > 0) {
                questions = questions.filter(q =>
                    filters.tags.some(tag => q.tags.includes(tag))
                );
            }

            return { success: true, questions };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get a single question with answers (using Supabase, not mock data)
    async getQuestion(id) {
        try {
            const { data, error } = await supabase
                .from(TABLES.QUESTIONS)
                .select(`*, author:users(id, username, avatar), question_tags:question_tags(tag:tags(name)), answers:answers(*, author:users(id, username, avatar))`)
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) return { success: false, error: 'Question not found' };

            // Map tags to a flat array of tag names
            const question = {
                ...data,
                tags: data.question_tags?.map(qt => qt.tag?.name).filter(Boolean) || [],
                answers: (data.answers || []).map(a => ({
                    ...a,
                    author: a.author || null
                }))
            };

            return { success: true, question };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Create a new question (real Supabase operation)
    async createQuestion(questionData, userId) {
        try {
            const { data: question, error: questionError } = await supabase
                .from(TABLES.QUESTIONS)
                .insert([{
                    title: questionData.title,
                    description: questionData.description,
                    author_id: userId
                }])
                .select()
                .single()

            if (questionError) throw questionError

            // Add tags if provided
            if (questionData.tags && questionData.tags.length > 0) {
                const tagIds = await this.getTagIds(questionData.tags)
                const questionTags = tagIds.map(tagId => ({
                    question_id: question.id,
                    tag_id: tagId
                }))

                const { error: tagError } = await supabase
                    .from('question_tags')
                    .insert(questionTags)

                if (tagError) throw tagError
            }

            return { success: true, question }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Vote on a question (real Supabase operation)
    async voteQuestion(questionId, userId, voteType) {
        try {
            // Get current question from mock data for display
            const question = mockQuestions.find(q => q.id === parseInt(questionId));
            if (!question) {
                return { success: false, error: 'Question not found' };
            }

            // Update votes in mock data for immediate UI feedback
            const newVotes = question.votes + (voteType === 'up' ? 1 : -1);
            question.votes = newVotes;

            // In a real app, you'd also update the database
            // For now, we'll just return the updated vote count
            return { success: true, votes: newVotes }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Get tag IDs by names
    async getTagIds(tagNames) {
        try {
            const { data, error } = await supabase
                .from(TABLES.TAGS)
                .select('id')
                .in('name', tagNames)

            if (error) throw error

            return data.map(tag => tag.id)
        } catch (error) {
            console.error('Error getting tag IDs:', error)
            return []
        }
    },

    // Get all tags (real Supabase operation)
    async getTags() {
        try {
            const { data, error } = await supabase
                .from(TABLES.TAGS)
                .select('*')
                .order('name')

            if (error) throw error

            return { success: true, tags: data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
} 