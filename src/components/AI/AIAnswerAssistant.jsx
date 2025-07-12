import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check } from 'lucide-react';
import Button from '../UI/Button';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { getGeminiAISuggestion } from '../../lib/gemini';

const AIAnswerAssistant = ({ questionTitle, questionDescription, onUseSuggestion }) => {
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const generateAISuggestion = async () => {
        setLoading(true);
        setError('');
        setSuggestion('');
        try {
            const prompt = `Question: ${questionTitle}\n\n${questionDescription}\n\nWrite a comprehensive, step-by-step answer with code examples and best practices. Format using markdown.`;
            const result = await getGeminiAISuggestion({ prompt });
            if (result.success && result.suggestion) {
                setSuggestion(result.suggestion);
            } else if (result.error === 'Gemini API key not set') {
                setError('AI features are unavailable. Please set up the Gemini API key.');
            } else {
                setError(result.error || 'Failed to generate suggestion.');
            }
        } catch (err) {
            setError('AI suggestion error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(suggestion);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const useSuggestion = () => {
        onUseSuggestion(suggestion);
    };

    return (
        <div className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:bg-charcoal-800 dark:bg-none border border-purple-200 dark:border-charcoal-700">
            <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-secondary-100">AI Answer Assistant</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-secondary-300 mb-4">
                Get AI-powered suggestions to write better, more comprehensive answers.
            </p>
            {error && (
                <div className="mb-4 text-danger-600 text-sm dark:text-danger-400">{error}</div>
            )}
            {!suggestion && !error ? (
                <Button
                    onClick={generateAISuggestion}
                    loading={loading}
                    variant="primary"
                    className="w-full"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {loading ? 'Generating...' : 'Generate AI Suggestion'}
                </Button>
            ) : null}
            {suggestion && (
                <div className="space-y-4">
                    <div className="bg-white dark:bg-charcoal-700 p-4 rounded-lg border border-gray-200 dark:border-charcoal-600">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-secondary-100">AI Suggestion</span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{suggestion}</ReactMarkdown>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            onClick={useSuggestion}
                            variant="primary"
                            className="flex-1"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Use This Suggestion
                        </Button>
                        <Button
                            onClick={() => setSuggestion('')}
                            variant="outline"
                        >
                            Generate New
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAnswerAssistant; 