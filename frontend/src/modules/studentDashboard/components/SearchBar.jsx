import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useDashboard } from '../context/DashboardContext';

const SearchBar = () => {
    const { searchQuery, handleSearch, filters, handleFilterChange } = useDashboard();
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchInput = (e) => {
        handleSearch(e.target.value);
    };

    return (
        <div className="relative w-full md:w-auto">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchInput}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-yellow-300/50 focus:ring-1 focus:ring-yellow-300/50 transition-all duration-200"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 rounded-xl border transition-all duration-200 ${
                        showFilters 
                            ? 'bg-yellow-400/20 border-yellow-300/30 text-yellow-300' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <FaFilter />
                </button>
            </div>

            {/* Filters Dropdown */}
            {showFilters && (
                <div className="absolute right-0 mt-2 w-72 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-4 z-10">
                    <div className="space-y-4">
                        {/* Difficulty Filter */}
                        <div>
                            <label className="block text-white/70 mb-2 text-sm">Difficulty Level</label>
                            <select
                                value={filters.difficulty || ''}
                                onChange={(e) => handleFilterChange({ difficulty: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-300/50 focus:ring-1 focus:ring-yellow-300/50"
                            >
                                <option value="">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Duration Filter */}
                        <div>
                            <label className="block text-white/70 mb-2 text-sm">Duration</label>
                            <select
                                value={filters.duration || ''}
                                onChange={(e) => handleFilterChange({ duration: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-300/50 focus:ring-1 focus:ring-yellow-300/50"
                            >
                                <option value="">Any Duration</option>
                                <option value="short">Short (‹ 1 hour)</option>
                                <option value="medium">Medium (1-3 hours)</option>
                                <option value="long">Long (› 3 hours)</option>
                            </select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="block text-white/70 mb-2 text-sm">Minimum Rating</label>
                            <select
                                value={filters.rating || ''}
                                onChange={(e) => handleFilterChange({ rating: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-300/50 focus:ring-1 focus:ring-yellow-300/50"
                            >
                                <option value="">Any Rating</option>
                                <option value="4">4+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="2">2+ Stars</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar; 