const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/videoController');
const { authenticateToken } = require('../../../middleware/authMiddleware');
const { requireInstructor } = require('../../auth/middleware/roleMiddleware');

// Debug middleware
router.use((req, res, next) => {
    console.log('Video route accessed:', req.method, req.path);
    console.log('Headers:', req.headers);
    next();
});

router.use(authenticateToken);
router.use(requireInstructor);

// Video routes
router.post('/upload', VideoController.uploadVideo);
router.post('/youtube', VideoController.addYoutubeVideo);
router.get('/', VideoController.getVideos);
router.get('/:id', VideoController.getVideoById);
router.put('/:id', VideoController.updateVideo);
router.delete('/:id', VideoController.deleteVideo);

module.exports = router; 