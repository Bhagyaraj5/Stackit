import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { questionService } from '../services/questionService';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const TAG_CATEGORIES = [
    {
        category: 'Web Development',
        tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'jQuery', 'WebAssembly', 'GraphQL', 'REST', 'Redux', 'SASS', 'Webpack', 'Vite', 'Gatsby', 'Nuxt.js']
    },
    {
        category: 'App Development',
        tags: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS', 'Expo', 'Cordova', 'Xamarin', 'Ionic']
    },
    {
        category: 'Game Development',
        tags: ['Unity', 'Unreal Engine', 'Godot', 'GameMaker', 'Cocos2d', 'Phaser', 'LibGDX', 'Pygame']
    },
    {
        category: 'AI & Machine Learning',
        tags: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'OpenCV', 'NLP', 'Deep Learning', 'Machine Learning', 'Data Science', 'Pandas', 'NumPy', 'Jupyter', 'Hugging Face', 'LangChain', 'Gemini', 'OpenAI', 'LLM']
    },
    {
        category: 'Cybersecurity',
        tags: ['Security', 'Penetration Testing', 'OWASP', 'Ethical Hacking', 'CVE', 'Encryption', 'Network Security', 'Malware', 'Forensics', 'Bug Bounty']
    },
    {
        category: 'Frameworks',
        tags: ['Django', 'Flask', 'Express', 'Spring', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'FastAPI', 'NestJS', 'Meteor', 'Symfony']
    },
    {
        category: 'Libraries',
        tags: ['Lodash', 'Moment.js', 'Axios', 'RxJS', 'Three.js', 'Chart.js', 'D3.js', 'Socket.io', 'Jest', 'Mocha', 'Chai', 'Testing Library']
    },
    {
        category: 'Languages',
        tags: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Perl', 'R', 'MATLAB', 'Dart', 'Objective-C']
    }
];

const AskQuestion = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Flatten all tags for search
    const allTags = TAG_CATEGORIES.flatMap(cat => cat.tags);
    const filteredTags = tagInput
        ? allTags.filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag))
        : allTags.filter(tag => !selectedTags.includes(tag));

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
        setShowTagSuggestions(true);
    };

    const handleTagSelect = (tag) => {
        if (selectedTags.includes(tag)) return;
        if (selectedTags.length < 5) {
            setSelectedTags([...selectedTags, tag]);
            setTagInput('');
            setShowTagSuggestions(false);
        }
    };

    const handleTagRemove = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    useEffect(() => {
        const loadTags = async () => {
            try {
                const result = await questionService.getTags();
                if (result.success) {
                    // setAvailableTags(result.tags); // This line is no longer needed
                }
            } catch (error) {
                console.error('Failed to load tags:', error);
            }
        };

        loadTags();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card p-8 text-center">
                    <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                        Sign in to ask a question
                    </h1>
                    <p className="text-secondary-600 mb-6">
                        You need to be signed in to ask questions on StackIt.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/auth')}>
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        } else if (title.trim().length < 10) {
            newErrors.title = 'Title must be at least 10 characters long';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.trim().length < 20) {
            newErrors.description = 'Description must be at least 20 characters long';
        }

        if (selectedTags.length === 0) {
            newErrors.tags = 'Please select at least one tag';
        } else if (selectedTags.length > 5) {
            newErrors.tags = 'You can select up to 5 tags';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const questionData = {
                title: title.trim(),
                description: description.trim(),
                tags: selectedTags
            };

            const result = await questionService.createQuestion(questionData, user.id);

            if (result.success) {
                // Navigate to the new question
                navigate(`/question/${result.question.id}`);
            } else {
                setErrors({ general: result.error || 'Failed to create question' });
            }
        } catch (error) {
            setErrors({ general: 'Error creating question: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const getTagColor = (tag) => {
        const colors = {
            'React': 'tag-blue',
            'JavaScript': 'tag-orange',
            'TypeScript': 'tag-purple',
            'Node.js': 'tag-green',
            'Express': 'tag-green',
            'API': 'tag-blue',
            'Performance': 'tag-orange',
            'CSS': 'tag-purple',
            'Tailwind CSS': 'tag-blue',
            'Dark Mode': 'tag-purple',
            'Async': 'tag-orange',
            'Promises': 'tag-orange',
            'ES6': 'tag-orange',
            'Error Handling': 'tag-red',
            'Programming': 'tag-blue',
            'Hooks': 'tag-blue'
        };
        return colors[tag] || 'tag-blue';
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                    Ask a Question
                </h1>
                <p className="text-secondary-600 dark:text-secondary-300">
                    Share your knowledge and help others learn.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <div className="card p-6">
                        {errors.general && (
                            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                                <p className="text-sm text-danger-600">{errors.general}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <Input
                                    label="Title"
                                    placeholder="What's your question? Be specific."
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (errors.title) setErrors({ ...errors, title: '' });
                                    }}
                                    error={errors.title}
                                    helperText="A good title helps others find and answer your question."
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        if (errors.description) setErrors({ ...errors, description: '' });
                                    }}
                                    placeholder="Describe your question in detail. You can use markdown formatting."
                                    className="w-full h-48 px-3 py-2 border-2 border-secondary-200 dark:border-charcoal-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors duration-200 resize-none dark:bg-charcoal-800 dark:text-secondary-100"
                                    disabled={loading}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-danger-600">{errors.description}</p>
                                )}
                                <p className="mt-1 text-xs text-secondary-500">
                                    {description.length} characters (minimum 20)
                                </p>
                                {description.trim() && (
                                    <div className="mt-3">
                                        <div className="text-xs text-secondary-500 mb-1">Markdown Preview:</div>
                                        <div className="prose prose-sm max-w-none border border-secondary-200 rounded p-3 bg-secondary-50">
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{description}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Tags
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={selectedTags.length >= 5 ? 'Maximum 5 tags selected' : 'Search and add tags'}
                                        value={tagInput}
                                        onChange={handleTagInputChange}
                                        onFocus={() => setShowTagSuggestions(true)}
                                        disabled={selectedTags.length >= 5}
                                        className="w-full px-3 py-2 border-2 border-secondary-200 dark:border-charcoal-700 rounded-lg focus:outline-none focus:border-primary-500 transition-colors duration-200 dark:bg-charcoal-800 dark:text-secondary-100"
                                    />
                                    {showTagSuggestions && filteredTags.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-charcoal-800 border border-secondary-200 dark:border-charcoal-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                                            <div className="p-3 border-b border-secondary-200 dark:border-charcoal-700">
                                                <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Tag Suggestions</h3>
                                            </div>
                                            <div className="p-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {filteredTags.slice(0, 30).map((tag) => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => handleTagSelect(tag)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                                                                ? 'bg-primary-100 text-primary-700'
                                                                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-charcoal-700 dark:text-secondary-100 dark:hover:bg-charcoal-600'
                                                                }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.tags && (
                                    <p className="mt-1 text-sm text-danger-600">{errors.tags}</p>
                                )}
                                <p className="mt-1 text-xs text-secondary-500">
                                    {selectedTags.length}/5 tags selected
                                </p>
                                {selectedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`tag flex items-center space-x-1`}
                                            >
                                                <span className="text-sm font-medium">{tag}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleTagRemove(tag)}
                                                    className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={loading}
                                    disabled={loading}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Post Question
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Writing Guidelines */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                            <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
                            Writing Guidelines
                        </h3>
                        <ul className="space-y-2 text-sm text-secondary-600">
                            <li>• Be specific and clear in your question</li>
                            <li>• Include relevant code examples</li>
                            <li>• Describe what you've already tried</li>
                            <li>• Use appropriate tags</li>
                            <li>• Check for similar questions first</li>
                        </ul>
                    </div>

                    {/* Tag Help */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                            About Tags
                        </h3>
                        <p className="text-sm text-secondary-600 mb-3">
                            Tags help organize questions and make them easier to find.
                        </p>
                        <ul className="space-y-1 text-sm text-secondary-600">
                            <li>• Choose 1-5 relevant tags</li>
                            <li>• Use existing tags when possible</li>
                            <li>• Be specific but not too narrow</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskQuestion; 