import React, { useState, useCallback } from 'react';
import { FaSearch, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useDashboard } from '../context/DashboardContext';
import { categories, difficultyLevels, getDifficultyColor } from '../utils/filterHelper';

const SearchBar = ({ disabled }) => {
    const { 
        handleSearch, 
        handleCategoryFilter, 
        handleDifficultyFilter, 
        filters,
        activeView,
        loading 
    } = useDashboard();
    
    const [searchInput, setSearchInput] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        handleSearch(searchInput);
    }, [searchInput, handleSearch]);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        handleCategoryFilter(value);
        if (!value) setIsFilterOpen(false);
    };

    const handleDifficultyChange = (e) => {
        const value = e.target.value;
        handleDifficultyFilter(value);
        if (!value) setIsFilterOpen(false);
    };

    const clearFilters = () => {
        handleCategoryFilter('');
        handleDifficultyFilter('');
        setIsFilterOpen(false);
    };

    const hasActiveFilters = filters.category || filters.difficultyLevel;

    return (
        <div className="relative space-y-4">
            {/* Main Search Bar Container */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input Group */}
                <div className="flex-1">
                    <form onSubmit={handleSearchSubmit} className="relative group">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={`Search ${activeView}...`}
                            className="w-full h-14 pl-14 pr-12 bg-white/10 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 
                                focus:outline-none focus:border-yellow-400/50 focus:bg-white/20 focus:placeholder-white/50
                                transition-all duration-300 text-base font-medium
                                group-hover:border-white/20 group-hover:bg-white/[0.15]"
                            disabled={disabled || loading}
                        />
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                            <FaSearch className="text-lg text-white/40 group-hover:text-white/60 transition-colors duration-300" />
                        </div>
                        {searchInput && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchInput('');
                                    handleSearch('');
                                }}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/90 transition-colors duration-300"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Filter Button */}
                <button
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`h-14 px-8 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3
                        ${isFilterOpen || hasActiveFilters
                            ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400 shadow-lg shadow-yellow-400/10'
                            : 'bg-white/10 border-white/10 text-white hover:bg-white/[0.15] hover:border-white/20'
                        } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                    disabled={disabled || loading}
                >
                    <FaFilter className={`text-lg ${hasActiveFilters ? 'animate-pulse' : ''}`} />
                    <span className="font-semibold">Filters</span>
                    {hasActiveFilters && (
                        <span className="flex items-center justify-center w-6 h-6 text-xs font-bold bg-yellow-400 text-gray-900 rounded-lg shadow-inner">
                            {(filters.category ? 1 : 0) + (filters.difficultyLevel ? 1 : 0)}
                        </span>
                    )}
                </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex items-center gap-4 p-4 bg-white/[0.08] backdrop-blur-lg rounded-xl border border-white/10 shadow-lg">
                    <span className="text-sm font-semibold text-white/70">Active Filters:</span>
                    <div className="flex flex-wrap gap-2">
                        {filters.category && (
                            <span className="px-4 py-2 text-sm font-medium bg-yellow-400/10 text-yellow-400 rounded-lg border border-yellow-400/20 
                                flex items-center gap-2 hover:bg-yellow-400/20 transition-colors duration-300">
                                {categories.find(c => c.id === filters.category)?.label}
                                <button
                                    onClick={() => handleCategoryFilter('')}
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </span>
                        )}
                        {filters.difficultyLevel && (
                            <span className={`px-4 py-2 text-sm font-medium rounded-lg border flex items-center gap-2 
                                ${getDifficultyColor(filters.difficultyLevel)} border-current border-opacity-20 
                                hover:bg-opacity-20 transition-colors duration-300`}>
                                {difficultyLevels.find(d => d.id === filters.difficultyLevel)?.label}
                                <button
                                    onClick={() => handleDifficultyFilter('')}
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </span>
                        )}
                    </div>
                    <button
                        onClick={clearFilters}
                        className="ml-auto text-sm font-medium text-white/50 hover:text-white transition-colors duration-200 
                            px-3 py-1.5 rounded-lg hover:bg-white/10"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Filter Panel Dropdown */}
            {isFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 p-6 bg-white/[0.08] backdrop-blur-xl border border-white/10 
                    rounded-2xl z-10 shadow-2xl transform transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Filter */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-white/90">
                                Category
                            </label>
                            <div className="relative group">
                                <select
                                    value={filters.category}
                                    onChange={handleCategoryChange}
                                    className="w-full h-12 pl-4 pr-12 bg-white/10 border-2 border-white/10 rounded-xl text-white 
                                        appearance-none focus:outline-none focus:border-yellow-400/50 focus:bg-white/20 
                                        transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                                        group-hover:border-white/20 group-hover:bg-white/[0.15]"
                                    disabled={disabled || loading}
                                >
                                    <option value="" className="bg-gray-900/95">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id} className="bg-gray-900/95">
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 
                                    group-hover:text-white/60 transition-colors duration-300 pointer-events-none" />
                            </div>
                        </div>

                        {/* Difficulty Level Filter */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-white/90">
                                Difficulty Level
                            </label>
                            <div className="relative group">
                                <select
                                    value={filters.difficultyLevel}
                                    onChange={handleDifficultyChange}
                                    className="w-full h-12 pl-4 pr-12 bg-white/10 border-2 border-white/10 rounded-xl text-white 
                                        appearance-none focus:outline-none focus:border-yellow-400/50 focus:bg-white/20 
                                        transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                                        group-hover:border-white/20 group-hover:bg-white/[0.15]"
                                    disabled={disabled || loading}
                                >
                                    <option value="" className="bg-gray-900/95">All Levels</option>
                                    {difficultyLevels.map(level => (
                                        <option key={level.id} value={level.id} className="bg-gray-900/95">
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 
                                    group-hover:text-white/60 transition-colors duration-300 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar; 