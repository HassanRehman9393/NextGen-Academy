const videoRoutes = require('./routes/videoRoutes');
const VideoService = require('./services/videoService');
const VideoController = require('./controllers/videoController');
const { authenticateToken } = require('./middleware/authMiddleware');
const { requireInstructor } = require('./middleware/roleMiddleware');

module.exports = {
    routes: videoRoutes,
    VideoService,
    VideoController,
    authenticateToken,
    requireInstructor
}; 