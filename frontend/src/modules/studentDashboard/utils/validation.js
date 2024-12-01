import { categories, difficultyLevels } from './filterHelper';

/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {Object} Validation result
 */
export const validateSearchQuery = (query) => {
    const errors = [];
    
    if (query && query.length < 2) {
        errors.push('Search query must be at least 2 characters long');
    }
    
    if (query && query.length > 50) {
        errors.push('Search query cannot exceed 50 characters');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate category
 * @param {string} category - Category ID
 * @returns {Object} Validation result
 */
export const validateCategory = (category) => {
    if (!category) return { isValid: true };
    
    const isValid = categories.some(c => c.id === category);
    return {
        isValid,
        error: isValid ? null : 'Invalid category selected'
    };
};

/**
 * Validate difficulty level
 * @param {string} level - Difficulty level
 * @returns {Object} Validation result
 */
export const validateDifficultyLevel = (level) => {
    if (!level) return { isValid: true };
    
    const isValid = difficultyLevels.some(d => d.id === level);
    return {
        isValid,
        error: isValid ? null : 'Invalid difficulty level selected'
    };
};

/**
 * Validate sort parameters
 * @param {Object} params - Sort parameters
 * @returns {Object} Validation result
 */
export const validateSortParams = (params) => {
    const errors = [];
    
    if (params.sortBy && !['createdAt', 'title', 'rating', 'enrollmentCount', 'viewCount'].includes(params.sortBy)) {
        errors.push('Invalid sort field');
    }
    
    if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder)) {
        errors.push('Invalid sort order');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} Validation result
 */
export const validatePaginationParams = (params) => {
    const errors = [];
    const { page, limit } = params;
    
    if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
        errors.push('Page number must be a positive integer');
    }
    
    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        errors.push('Items per page must be between 1 and 100');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate all filter parameters
 * @param {Object} filters - Filter parameters
 * @returns {Object} Validation result
 */
export const validateFilters = (filters) => {
    const errors = [];
    
    // Validate search query
    const searchValidation = validateSearchQuery(filters.search);
    if (!searchValidation.isValid) {
        errors.push(...searchValidation.errors);
    }
    
    // Validate category
    const categoryValidation = validateCategory(filters.category);
    if (!categoryValidation.isValid) {
        errors.push(categoryValidation.error);
    }
    
    // Validate difficulty level
    const difficultyValidation = validateDifficultyLevel(filters.difficultyLevel);
    if (!difficultyValidation.isValid) {
        errors.push(difficultyValidation.error);
    }
    
    // Validate sort parameters
    const sortValidation = validateSortParams({
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
    });
    if (!sortValidation.isValid) {
        errors.push(...sortValidation.errors);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}; 