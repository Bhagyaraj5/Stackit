import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    ChevronDown,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Plus,
    BarChart3,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationPanel from '../Common/NotificationPanel';
import Button from '../UI/Button';

const Navbar = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortFilter, setSortFilter] = useState('newest');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const sortMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
                setIsSortMenuOpen(false);
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className="bg-white dark:bg-charcoal-900 border-b border-secondary-200 dark:border-charcoal-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold text-secondary-900 dark:text-secondary-100">StackIt</span>
                    </Link>

                    {/* Desktop Search and Filters */}
                    <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-charcoal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-charcoal-800 dark:text-secondary-100"
                                />
                            </div>
                        </form>

                        {/* Sort Filter */}
                        <div className="relative" ref={sortMenuRef}>
                            <button
                                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                className="flex items-center space-x-1 px-3 py-2 text-sm text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                            >
                                <span>{sortOptions.find(opt => opt.value === sortFilter)?.label}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {isSortMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-charcoal-800 rounded-lg shadow-lg border border-secondary-200 dark:border-charcoal-700 z-50">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortFilter(option.value);
                                                setIsSortMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-charcoal-700 first:rounded-t-lg last:rounded-b-lg ${sortFilter === option.value ? 'bg-primary-50 dark:bg-charcoal-700 text-primary-700 dark:text-primary-200' : 'text-secondary-700 dark:text-secondary-100'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Right Side */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-gray-800 transition-colors"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
                        </button>
                        {/* Ask Question Button */}
                        <Link to="/ask">
                            <Button variant="primary" size="sm">
                                <Plus className="w-4 h-4 mr-1" />
                                Ask Question
                            </Button>
                        </Link>

                        {/* Notifications */}
                        <NotificationPanel />

                        {/* User Menu */}
                        {isLoggedIn ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <ChevronDown className="w-4 h-4 text-secondary-500" />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 z-50">
                                        <div className="px-4 py-3 border-b border-secondary-200">
                                            <p className="text-sm font-medium text-secondary-900">{user.username}</p>
                                            <p className="text-xs text-secondary-500">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                                            >
                                                <User className="w-4 h-4 mr-2" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/analytics"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                                            >
                                                <BarChart3 className="w-4 h-4 mr-2" />
                                                Analytics
                                            </Link>
                                            <button
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Settings
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/auth">
                                <Button variant="outline" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-secondary-200 py-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-charcoal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-charcoal-800 dark:text-secondary-100"
                                />
                            </div>
                        </form>

                        {/* Mobile Sort Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-secondary-700 mb-2">Sort by</label>
                            <select
                                value={sortFilter}
                                onChange={(e) => setSortFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-secondary-300 dark:border-charcoal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-charcoal-800 dark:text-secondary-100"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mobile Actions */}
                        <div className="space-y-2">
                            <Link
                                to="/ask"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Ask Question
                            </Link>

                            {isLoggedIn ? (
                                <div className="space-y-2">
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/auth"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 