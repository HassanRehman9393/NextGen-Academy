const courseRoutes = require('./routes/courseRoutes');
const CourseService = require('./services/courseService');
const CourseController = require('./controllers/courseController');
const Course = require('./models/courseModel');
const { validateCourse } = require('./utils/validation');
const SequenceUtils = require('./utils/sequenceUtils');

module.exports = {
    courseRoutes,
    CourseService,
    CourseController,
    Course,
    validateCourse,
    SequenceUtils
}; 