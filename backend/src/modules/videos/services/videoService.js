const Video = require('../models/videoModel');
const YouTubeAPI = require('../utils/youtubeApi');

class VideoService {
    async createVideo(videoData) {
        return await Video.create(videoData);
    }

    async getVideosByInstructor(instructorId) {
        try {
            console.log('Fetching videos for instructor:', instructorId);
            const videos = await Video.find({ uploadedBy: instructorId });
            console.log('Found videos:', videos);
            return videos;
        } catch (error) {
            console.error('Error in getVideosByInstructor:', error);
            throw error;
        }
    }

    async getVideoById(videoId) {
        return await Video.findById(videoId);
    }

    async updateVideo(videoId, updateData, userId) {
        const video = await Video.findById(videoId);
        if (!video) throw new Error('Video not found');
        if (video.uploadedBy.toString() !== userId.toString()) {
            throw new Error('Unauthorized to update this video');
        }
        return await Video.findByIdAndUpdate(videoId, updateData, { new: true });
    }

    async deleteVideo(videoId, userId) {
        const video = await Video.findById(videoId);
        if (!video) throw new Error('Video not found');
        if (video.uploadedBy.toString() !== userId.toString()) {
            throw new Error('Unauthorized to delete this video');
        }
        return await Video.findByIdAndDelete(videoId);
    }

    async validateYoutubeVideo(url) {
        const videoId = YouTubeAPI.extractVideoId(url);
        if (!videoId) throw new Error('Invalid YouTube URL');
        return await YouTubeAPI.getVideoDetails(videoId);
    }
}

module.exports = new VideoService(); 