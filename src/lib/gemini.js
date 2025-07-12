// Gemini API utility
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function getGeminiAISuggestion({ prompt }) {
    if (!GEMINI_API_KEY) {
        return { success: false, error: 'Gemini API key not set' };
    }
    try {
        const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        if (!res.ok) {
            return { success: false, error: 'Gemini API error' };
        }
        const data = await res.json();
        const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return { success: true, suggestion };
    } catch (error) {
        return { success: false, error: error.message };
    }
} 