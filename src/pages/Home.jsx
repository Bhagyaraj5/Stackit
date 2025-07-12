import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionService } from '../services/questionService';
import { questions as mockQuestions, availableTags } from '../utils/mockData';
import QuestionList from '../components/Questions/QuestionList';
import FilterBar from '../components/Questions/FilterBar';
import Button from '../components/UI/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
    const { isLoggedIn } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const questionsPerPage = 10;

    // Get search query from URL
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const loadQuestions = async () => {
            setLoading(true);
            try {
                if (isLoggedIn) {
                    // Use real data for authenticated users
                    const filters = {
                        search: searchQuery,
                        tags: selectedTags,
                        sort: sortBy
                    };

                    const result = await questionService.getQuestions(filters);

                    if (result.success) {
                        setQuestions(result.questions);
                        setTotalQuestions(result.questions.length);
                        setError(null);
                    } else {
                        setError(result.error || 'Failed to load questions');
                        setQuestions([]);
                    }
                } else {
                    // Use mock data for non-authenticated users
                    let filteredQuestions = [...mockQuestions];

                    // Apply search filter
                    if (searchQuery) {
                        filteredQuestions = filteredQuestions.filter(q =>
                            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            q.description.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    }

                    // Apply tag filter
                    if (selectedTags.length > 0) {
                        filteredQuestions = filteredQuestions.filter(q =>
                            selectedTags.some(tag => q.tags.includes(tag))
                        );
                    }

                    // Apply sorting
                    filteredQuestions.sort((a, b) => {
                        switch (sortBy) {
                            case 'newest':
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            case 'oldest':
                                return new Date(a.createdAt) - new Date(b.createdAt);
                            case 'votes':
                                return b.votes - a.votes;
                            case 'views':
                                return b.views - a.views;
                            default:
                                return new Date(b.createdAt) - new Date(a.createdAt);
                        }
                    });

                    setQuestions(filteredQuestions);
                    setTotalQuestions(filteredQuestions.length);
                    setError(null);
                }
            } catch (err) {
                setError('Failed to load questions');
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [searchQuery, selectedTags, sortBy, isLoggedIn]);

    // Pagination
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = questions.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        setCurrentPage(1);
    };

    const handleTagsChange = (newTags) => {
        setSelectedTags(newTags);
        setCurrentPage(1);
    };

    const handleVoteUpdate = (questionId, newVotes) => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === questionId ? { ...q, votes: newVotes } : q
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">
                        {searchQuery ? `Search results for "${searchQuery}"` : 'All Questions'}
                    </h1>
                    <p className="text-secondary-600 mt-1">
                        {loading ? 'Loading...' : `${totalQuestions} question${totalQuestions !== 1 ? 's' : ''}`}
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
                sortBy={sortBy}
                onSortChange={handleSortChange}
                selectedTags={selectedTags}
                onTagsChange={handleTagsChange}
            />

            {/* Question List */}
            <QuestionList
                questions={currentQuestions}
                loading={loading}
                error={error}
                onVoteUpdate={handleVoteUpdate}
            />

            {/* Pagination */}
            {totalPages > 1 && !loading && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${page === currentPage
                                    ? 'bg-primary-500 text-white'
                                    : 'text-secondary-600 hover:bg-secondary-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Empty State for Search */}
            {!loading && searchQuery && questions.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-secondary-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No questions found
                    </h3>
                    <p className="text-secondary-600 mb-6">
                        No questions match your search for "{searchQuery}". Try different keywords or browse all questions.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => setSearchParams({})}
                    >
                        Browse All Questions
                    </Button>
                </div>
            )}

            {/* Empty State for No Questions */}
            {!loading && !searchQuery && questions.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-secondary-400 text-6xl mb-4">❓</div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                        No questions yet
                    </h3>
                    <p className="text-secondary-600 mb-6">
                        Be the first to ask a question and start building the community!
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/ask'}
                    >
                        Ask First Question
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Home; 