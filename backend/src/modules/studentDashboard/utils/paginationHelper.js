/**
 * Calculates pagination parameters for database queries
 * @param {number} page - Current page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {Object} Pagination parameters
 */
const getPaginationParams = (page = 1, limit = 10) => {
    try {
        // Ensure positive integers
        const validPage = Math.max(1, parseInt(page) || 1);
        const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

        const skip = (validPage - 1) * validLimit;

        return {
            skip,
            limit: validLimit
        };
    } catch (error) {
        console.error('Error calculating pagination params:', error);
        return {
            skip: 0,
            limit: 10
        };
    }
};

/**
 * Formats pagination metadata for API response
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMetadata = (totalItems, currentPage, limit) => {
    try {
        const validPage = Math.max(1, parseInt(currentPage) || 1);
        const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const totalPages = Math.ceil(totalItems / validLimit);

        return {
            totalItems,
            itemsPerPage: validLimit,
            currentPage: validPage,
            totalPages,
            hasNextPage: validPage < totalPages,
            hasPrevPage: validPage > 1,
            nextPage: validPage < totalPages ? validPage + 1 : null,
            prevPage: validPage > 1 ? validPage - 1 : null,
            firstPage: 1,
            lastPage: totalPages,
            currentRange: {
                start: Math.min(totalItems, (validPage - 1) * validLimit + 1),
                end: Math.min(totalItems, validPage * validLimit)
            }
        };
    } catch (error) {
        console.error('Error generating pagination metadata:', error);
        return {
            totalItems,
            itemsPerPage: 10,
            currentPage: 1,
            totalPages: Math.ceil(totalItems / 10),
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null
        };
    }
};

/**
 * Validates pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Validated parameters
 */
const validatePaginationParams = (page, limit) => {
    try {
        const DEFAULT_PAGE = 1;
        const DEFAULT_LIMIT = 10;
        const MAX_LIMIT = 100;

        let validatedPage = DEFAULT_PAGE;
        let validatedLimit = DEFAULT_LIMIT;

        if (page) {
            const parsedPage = parseInt(page);
            if (!isNaN(parsedPage) && parsedPage > 0) {
                validatedPage = parsedPage;
            }
        }

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                validatedLimit = Math.min(parsedLimit, MAX_LIMIT);
            }
        }

        return {
            page: validatedPage,
            limit: validatedLimit
        };
    } catch (error) {
        console.error('Error validating pagination params:', error);
        return {
            page: 1,
            limit: 10
        };
    }
};

module.exports = {
    getPaginationParams,
    getPaginationMetadata,
    validatePaginationParams
}; 