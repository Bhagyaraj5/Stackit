import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { availableTags } from '../../utils/mockData';

const FilterBar = ({
    sortBy,
    onSortChange,
    selectedTags,
    onTagsChange,
    className = ''
}) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const sortRef = useRef(null);
    const tagsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (tagsRef.current && !tagsRef.current.contains(event.target)) {
                setIsTagsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'most-votes', label: 'Most Votes' },
        { value: 'most-answers', label: 'Most Answers' },
        { value: 'unanswered', label: 'Unanswered' }
    ];

    const handleTagToggle = (tag) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        onTagsChange(newTags);
    };

    const clearAllTags = () => {
        onTagsChange([]);
    };

    return (
        <div className={`flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-charcoal-800 rounded-lg border border-secondary-200 dark:border-charcoal-700 ${className}`}>
            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
                <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-100 bg-secondary-50 dark:bg-charcoal-700 hover:bg-secondary-100 dark:hover:bg-charcoal-600 rounded-lg transition-colors duration-200"
                >
                    <span>Sort by:</span>
                    <span className="font-medium">
                        {sortOptions.find(opt => opt.value === sortBy)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {isSortOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-charcoal-800 rounded-lg shadow-lg border border-secondary-200 dark:border-charcoal-700 z-50">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSortChange(option.value);
                                    setIsSortOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-charcoal-700 first:rounded-t-lg last:rounded-b-lg ${sortBy === option.value ? 'bg-primary-50 dark:bg-charcoal-700 text-primary-700 dark:text-primary-200' : 'text-secondary-700 dark:text-secondary-100'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tags Filter */}
            <div className="relative" ref={tagsRef}>
                <button
                    onClick={() => setIsTagsOpen(!isTagsOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                >
                    <span>Tags:</span>
                    <span className="font-medium">
                        {selectedTags.length === 0 ? 'All' : `${selectedTags.length} selected`}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {isTagsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-charcoal-800 rounded-lg shadow-lg border border-secondary-200 dark:border-charcoal-700 z-50 max-h-64 overflow-y-auto">
                        <div className="p-3 border-b border-secondary-200 dark:border-charcoal-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Filter by tags</h3>
                                {selectedTags.length > 0 && (
                                    <button
                                        onClick={clearAllTags}
                                        className="text-xs text-primary-600 hover:text-primary-700"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-2 gap-2">
                                {availableTags.map((tag) => (
                                    <label
                                        key={tag}
                                        className="flex items-center space-x-2 cursor-pointer hover:bg-secondary-50 dark:hover:bg-charcoal-700 p-2 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTags.includes(tag)}
                                            onChange={() => handleTagToggle(tag)}
                                            className="rounded border-secondary-300 dark:border-charcoal-700 text-primary-600 focus:ring-primary-500 dark:bg-charcoal-800 dark:text-secondary-100"
                                        />
                                        <span className="text-sm text-secondary-700 dark:text-secondary-100">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                            {tag}
                            <button
                                onClick={() => handleTagToggle(tag)}
                                className="ml-1 hover:text-primary-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterBar; 