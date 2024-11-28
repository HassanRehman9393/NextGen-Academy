const { google } = require('googleapis');
const youtube = google.youtube('v3');

class YouTubeAPI {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
    }

    async getVideoDetails(videoId) {
        try {
            const response = await youtube.videos.list({
                key: this.apiKey,
                part: ['snippet', 'contentDetails', 'statistics'],
                id: [videoId]
            });

            if (!response.data.items.length) {
                throw new Error('Video not found');
            }

            return response.data.items[0];
        } catch (error) {
            console.error('YouTube API Error:', error);
            throw new Error('Failed to fetch video details from YouTube');
        }
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    validateUrl(url) {
        return !!this.extractVideoId(url);
    }
}

module.exports = new YouTubeAPI(); 