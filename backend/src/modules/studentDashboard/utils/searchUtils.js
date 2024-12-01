/**
 * Builds a search query object for MongoDB based on search parameters
 * @param {Object} params - Search parameters
 * @returns {Object} MongoDB query object
 */
const buildSearchQuery = (params = {}) => {
    try {
        const query = { isPublished: true };

        // Text search
        if (params.search) {
            query.$text = { $search: params.search };
        }

        // Category filter
        if (params.category) {
            query.category = params.category;
        }

        // Difficulty level filter (for courses)
        if (params.difficultyLevel) {
            query.difficultyLevel = params.difficultyLevel;
        }

        // Rating filter (for courses)
        if (params.minRating) {
            query.rating = { $gte: parseFloat(params.minRating) };
        }

        // Instructor filter
        if (params.instructor) {
            query.instructor = params.instructor;
        }

        return query;
    } catch (error) {
        console.error('Error building search query:', error);
        return { isPublished: true }; // Return base query on error
    }
};

/**
 * Builds sort options for MongoDB queries
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Object} MongoDB sort object
 */
const buildSortOptions = (sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const sortOptions = {};
        
        // Handle text search relevance sorting
        if (sortBy === 'relevance') {
            sortOptions.score = { $meta: 'textScore' };
            return sortOptions;
        }

        // Handle regular field sorting
        const validSortFields = [
            'createdAt', 
            'title', 
            'rating', 
            'viewCount', 
            'enrollmentCount'
        ];

        if (validSortFields.includes(sortBy)) {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1; // Default sort
        }

        return sortOptions;
    } catch (error) {
        console.error('Error building sort options:', error);
        return { createdAt: -1 }; // Default sort on error
    }
};

module.exports = {
    buildSearchQuery,
    buildSortOptions
}; 