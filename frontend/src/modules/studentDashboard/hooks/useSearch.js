import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { validateSearchQuery, validateFilters } from '../utils/validation';

const useSearch = (onSearch) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        difficultyLevel: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [errors, setErrors] = useState([]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query, currentFilters) => {
            // Validate search query
            const searchValidation = validateSearchQuery(query);
            if (!searchValidation.isValid) {
                setErrors(searchValidation.errors);
                return;
            }

            // Validate filters
            const filterValidation = validateFilters({
                search: query,
                ...currentFilters
            });
            if (!filterValidation.isValid) {
                setErrors(filterValidation.errors);
                return;
            }

            // Clear errors and perform search
            setErrors([]);
            onSearch({
                search: query,
                ...currentFilters
            });
        }, 500),
        [onSearch]
    );

    // Handle search input change
    const handleSearchChange = useCallback((value) => {
        setSearchQuery(value);
        debouncedSearch(value, filters);
    }, [debouncedSearch, filters]);

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        debouncedSearch(searchQuery, updatedFilters);
    }, [debouncedSearch, filters, searchQuery]);

    // Clear search and filters
    const handleClear = useCallback(() => {
        setSearchQuery('');
        setFilters({
            category: '',
            difficultyLevel: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setErrors([]);
        onSearch({});
    }, [onSearch]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return {
        searchQuery,
        filters,
        errors,
        handleSearchChange,
        handleFilterChange,
        handleClear
    };
};

export default useSearch; 