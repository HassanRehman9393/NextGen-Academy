import { formatDistanceToNow } from 'date-fns';

export const formatTimestamp = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const formatUserName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
}; 