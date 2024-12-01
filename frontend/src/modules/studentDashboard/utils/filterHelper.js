/**
 * Available categories for courses and videos
 */
export const categories = [
    { id: 'programming', label: 'Programming' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'personal-development', label: 'Personal Development' },
    { id: 'photography', label: 'Photography' },
    { id: 'music', label: 'Music' },
    { id: 'health', label: 'Health & Fitness' }
];

/**
 * Difficulty levels for courses
 */
export const difficultyLevels = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
];

/**
 * Sort options for courses
 */
export const courseSortOptions = [
    { id: 'createdAt', label: 'Latest', order: 'desc' },
    { id: 'title', label: 'Title', order: 'asc' },
    { id: 'rating', label: 'Rating', order: 'desc' },
    { id: 'enrollmentCount', label: 'Most Popular', order: 'desc' }
];

/**
 * Sort options for videos
 */
export const videoSortOptions = [
    { id: 'createdAt', label: 'Latest', order: 'desc' },
    { id: 'title', label: 'Title', order: 'asc' },
    { id: 'viewCount', label: 'Most Viewed', order: 'desc' }
];

/**
 * Format duration string from minutes
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
        return `${remainingMinutes}m`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format view count with appropriate suffix
 * @param {number} count - Number of views
 * @returns {string} Formatted view count
 */
export const formatViewCount = (count) => {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
};

/**
 * Get color class for difficulty level
 * @param {string} level - Difficulty level
 * @returns {string} Tailwind color class
 */
export const getDifficultyColor = (level) => {
    switch (level) {
        case 'beginner':
            return 'text-green-400';
        case 'intermediate':
            return 'text-yellow-400';
        case 'advanced':
            return 'text-red-400';
        default:
            return 'text-gray-400';
    }
};

/**
 * Format rating to display with one decimal place
 * @param {number} rating - Rating value
 * @returns {string} Formatted rating
 */
export const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
}; 