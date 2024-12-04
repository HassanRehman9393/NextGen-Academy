const sanitizeComment = (content) => {
    if (!content) return '';

    // Remove HTML tags using regex
    const withoutTags = content.replace(/<[^>]*>/g, '');
    
    // Encode special characters
    const encoded = withoutTags
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    // Trim whitespace
    return encoded.trim();
};

module.exports = {
    sanitizeComment
}; 