export const validateComment = (content) => {
    if (!content || content.trim().length === 0) {
        return 'Comment cannot be empty';
    }
    
    if (content.length < 2) {
        return 'Comment must be at least 2 characters long';
    }
    
    if (content.length > 1000) {
        return 'Comment cannot exceed 1000 characters';
    }
    
    return null;
}; 