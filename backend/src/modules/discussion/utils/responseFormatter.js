/**
 * Formats a forum object for API response
 * @param {Object} forum - The forum document
 * @returns {Object} Formatted forum object
 */
const formatForum = (forum) => {
    if (!forum) return null;

    return {
        id: forum._id,
        title: forum.title,
        topic: forum.topic,
        description: forum.description,
        instructor: forum.instructorId ? {
            id: forum.instructorId._id,
            name: `${forum.instructorId.firstName} ${forum.instructorId.lastName}`,
            email: forum.instructorId.email
        } : null,
        courseId: forum.courseId,
        isActive: forum.isActive,
        commentsCount: forum.comments?.length || 0,
        createdAt: forum.createdAt,
        updatedAt: forum.updatedAt
    };
};

/**
 * Formats a comment object for API response
 * @param {Object} comment - The comment document
 * @returns {Object} Formatted comment object
 */
const formatComment = (comment) => {
    if (!comment) return null;

    return {
        id: comment._id,
        content: comment.content,
        student: comment.studentId ? {
            id: comment.studentId._id,
            name: `${comment.studentId.firstName} ${comment.studentId.lastName}`,
            email: comment.studentId.email
        } : null,
        replies: comment.replies?.map(formatReply) || [],
        repliesCount: comment.replies?.length || 0,
        createdAt: comment.createdAt
    };
};

/**
 * Formats a reply object for API response
 * @param {Object} reply - The reply document
 * @returns {Object} Formatted reply object
 */
const formatReply = (reply) => {
    if (!reply) return null;

    return {
        id: reply._id,
        content: reply.content,
        author: reply.authorId ? {
            id: reply.authorId._id,
            name: `${reply.authorId.firstName} ${reply.authorId.lastName}`,
            email: reply.authorId.email
        } : null,
        createdAt: reply.createdAt
    };
};

/**
 * Formats forum list response with pagination
 * @param {Object} data - The forums data with pagination
 * @returns {Object} Formatted forums list with pagination
 */
const formatForumsList = (data) => {
    return {
        forums: data.forums.map(formatForum),
        pagination: {
            total: data.total,
            page: data.page,
            totalPages: data.totalPages
        }
    };
};

/**
 * Formats detailed forum response with comments
 * @param {Object} forum - The forum document with populated comments
 * @returns {Object} Formatted forum with comments
 */
const formatForumDetails = (forum) => {
    if (!forum) return null;

    return {
        ...formatForum(forum),
        comments: forum.comments?.map(formatComment) || []
    };
};

module.exports = {
    formatForum,
    formatComment,
    formatReply,
    formatForumsList,
    formatForumDetails
}; 