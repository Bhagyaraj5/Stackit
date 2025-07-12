import { supabase, TABLES } from '../lib/supabase'
import { answers as mockAnswers } from '../utils/mockData'

export const answerService = {
    // Create a new answer (real Supabase operation)
    async createAnswer(answerData, userId) {
        try {
            const { data: answer, error } = await supabase
                .from(TABLES.ANSWERS)
                .insert([{
                    question_id: answerData.questionId,
                    content: answerData.content,
                    author_id: userId
                }])
                .select(`
          *,
          author:users(username, avatar, reputation)
        `)
                .single()

            if (error) throw error

            // Update question's answer count
            await supabase
                .from(TABLES.QUESTIONS)
                .update({
                    is_answered: true,
                    answers_count: supabase.raw('answers_count + 1')
                })
                .eq('id', answerData.questionId)

            return { success: true, answer }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Vote on an answer (using mock data for immediate feedback)
    async voteAnswer(answerId, userId, voteType) {
        try {
            // Find answer in mock data for immediate UI feedback
            const answer = mockAnswers.find(a => a.id === parseInt(answerId));
            if (!answer) {
                return { success: false, error: 'Answer not found' };
            }

            // Update votes in mock data
            const newVotes = answer.votes + (voteType === 'up' ? 1 : -1);
            answer.votes = newVotes;

            // In a real app, you'd also update the database
            // For now, we'll just return the updated vote count
            return { success: true, votes: newVotes }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Accept an answer (real Supabase operation)
    async acceptAnswer(answerId, questionId, userId) {
        try {
            // First, unaccept any previously accepted answers for this question
            await supabase
                .from(TABLES.ANSWERS)
                .update({ is_accepted: false })
                .eq('question_id', questionId)

            // Accept the selected answer
            const { error: acceptError } = await supabase
                .from(TABLES.ANSWERS)
                .update({ is_accepted: true })
                .eq('id', answerId)

            if (acceptError) throw acceptError

            // Update question to mark as answered
            const { error: questionError } = await supabase
                .from(TABLES.QUESTIONS)
                .update({
                    is_answered: true,
                    accepted_answer_id: answerId
                })
                .eq('id', questionId)

            if (questionError) throw questionError

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Update an answer (real Supabase operation)
    async updateAnswer(answerId, content, userId) {
        try {
            const { data, error } = await supabase
                .from(TABLES.ANSWERS)
                .update({
                    content,
                    updated_at: new Date().toISOString()
                })
                .eq('id', answerId)
                .eq('author_id', userId) // Ensure user can only edit their own answers
                .select()
                .single()

            if (error) throw error

            return { success: true, answer: data }
        } catch (error) {
            return { success: false, error: error.message }
        }
    },

    // Delete an answer (real Supabase operation)
    async deleteAnswer(answerId, userId) {
        try {
            const { error } = await supabase
                .from(TABLES.ANSWERS)
                .delete()
                .eq('id', answerId)
                .eq('author_id', userId) // Ensure user can only delete their own answers

            if (error) throw error

            return { success: true }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }
} 