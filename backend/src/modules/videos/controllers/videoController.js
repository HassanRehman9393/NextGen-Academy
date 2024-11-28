const VideoService = require('../services/videoService');
const { validateVideoInput } = require('../utils/validation');

class VideoController {
    async uploadVideo(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            if (!Array.isArray(req.user.roles)) {
                return res.status(403).json({
                    success: false,
                    message: 'User roles not properly configured'
                });
            }

            if (!req.user.roles.includes('instructor')) {
                return res.status(403).json({
                    success: false,
                    message: 'Only instructors can upload videos'
                });
            }

            const { title, description, category, videoUrl } = req.body;
            const validation = validateVideoInput({ title, description, category });
            
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            if (!videoUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Video URL is required'
                });
            }

            console.log('Creating video with data:', {
                title,
                description,
                category,
                type: 'file',
                url: videoUrl,
                uploadedBy: req.user._id
            });

            const video = await VideoService.createVideo({
                title,
                description,
                category,
                type: 'file',
                url: videoUrl,
                uploadedBy: req.user._id
            });

            console.log('Created video:', video);

            res.status(201).json({
                success: true,
                data: video
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async addYoutubeVideo(req, res) {
        try {
            if (!req.user || !req.user.roles.includes('instructor')) {
                return res.status(403).json({
                    success: false,
                    message: 'Only instructors can add videos'
                });
            }

            const { title, description, category, youtubeUrl } = req.body;

            // Validate required fields
            if (!title || !description || !category || !youtubeUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            // Validate YouTube URL
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
            if (!youtubeRegex.test(youtubeUrl)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid YouTube URL'
                });
            }

            const videoData = {
                title,
                description,
                category,
                type: 'youtube',
                url: youtubeUrl,
                uploadedBy: req.user._id
            };

            const video = await VideoService.createVideo(videoData);

            res.status(201).json({
                success: true,
                data: video
            });
        } catch (error) {
            console.error('YouTube upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Error adding YouTube video',
                error: error.message
            });
        }
    }

    async getVideos(req, res) {
        try {
            console.log('Getting videos for user:', req.user._id);
            console.log('User object:', req.user);
            
            const videos = await VideoService.getVideosByInstructor(req.user._id);
            console.log('Found videos:', videos);

            if (!videos || videos.length === 0) {
                console.log('No videos found for user');
                return res.json({
                    success: true,
                    data: []
                });
            }

            res.json({
                success: true,
                data: videos
            });
        } catch (error) {
            console.error('Error getting videos:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getVideoById(req, res) {
        try {
            const video = await VideoService.getVideoById(req.params.id);
            
            if (!video) {
                return res.status(404).json({
                    success: false,
                    message: 'Video not found'
                });
            }

            if (video.uploadedBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized to access this video'
                });
            }

            res.json({
                success: true,
                data: video
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateVideo(req, res) {
        try {
            const { title, description, category } = req.body;
            const validation = validateVideoInput({ title, description, category });
            
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validation.errors
                });
            }

            const updatedVideo = await VideoService.updateVideo(
                req.params.id,
                { title, description, category },
                req.user._id
            );

            res.json({
                success: true,
                data: updatedVideo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteVideo(req, res) {
        try {
            await VideoService.deleteVideo(req.params.id, req.user._id);
            
            res.json({
                success: true,
                message: 'Video deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new VideoController(); 