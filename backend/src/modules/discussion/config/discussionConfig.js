/**
 * Configuration settings for the discussion module
 */
const discussionConfig = {
    pagination: {
        defaultLimit: 10,
        maxLimit: 50
    },
    comments: {
        maxLength: 2000, // Maximum characters for a comment
        maxPerForum: 1000, // Maximum comments per forum
        minLength: 10 // Minimum characters for a comment
    },
    replies: {
        maxLength: 1000, // Maximum characters for a reply
        maxPerComment: 50, // Maximum replies per comment
        minLength: 5 // Minimum characters for a reply
    },
    forum: {
        titleMaxLength: 200,
        titleMinLength: 10,
        descriptionMaxLength: 5000,
        descriptionMinLength: 50,
        topicMaxLength: 100,
        topicMinLength: 5
    },
    moderation: {
        enableAutoModeration: true,
        flaggedWordsThreshold: 3,
        maxFlagsBeforeHide: 5
    },
    cache: {
        enabled: true,
        ttl: 3600, // Time to live in seconds (1 hour)
        maxSize: 100 // Maximum number of items to cache
    }
};

/**
 * Validation helper functions
 */
const validators = {
    isValidCommentLength: (content) => {
        return content.length >= discussionConfig.comments.minLength && 
               content.length <= discussionConfig.comments.maxLength;
    },

    isValidReplyLength: (content) => {
        return content.length >= discussionConfig.replies.minLength && 
               content.length <= discussionConfig.replies.maxLength;
    },

    isValidForumTitle: (title) => {
        return title.length >= discussionConfig.forum.titleMinLength && 
               title.length <= discussionConfig.forum.titleMaxLength;
    },

    isValidForumDescription: (description) => {
        return description.length >= discussionConfig.forum.descriptionMinLength && 
               description.length <= discussionConfig.forum.descriptionMaxLength;
    },

    isValidForumTopic: (topic) => {
        return topic.length >= discussionConfig.forum.topicMinLength && 
               topic.length <= discussionConfig.forum.topicMaxLength;
    }
};

module.exports = {
    config: discussionConfig,
    validators
}; 