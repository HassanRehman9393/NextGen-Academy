const enrollmentService = require('../services/enrollmentService');

class EnrollmentController {
    async enrollInCourse(req, res) {
        try {
            console.log('Enrollment request:', {
                studentId: req.user._id,
                courseId: req.params.courseId
            });

            const enrollment = await enrollmentService.enrollStudent(
                req.user._id,
                req.params.courseId
            );

            res.status(201).json({
                success: true,
                message: 'Successfully enrolled in course',
                data: enrollment
            });
        } catch (error) {
            console.error('Enrollment error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateProgress(req, res) {
        try {
            console.log('Progress update request:', {
                studentId: req.user._id,
                courseId: req.params.courseId,
                contentId: req.params.contentId,
                progressData: req.body
            });

            const enrollment = await enrollmentService.updateProgress(
                req.user._id,
                req.params.courseId,
                req.params.contentId,
                req.body
            );

            res.json({
                success: true,
                message: 'Progress updated successfully',
                data: enrollment
            });
        } catch (error) {
            console.error('Progress update error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getEnrollmentStatus(req, res) {
        try {
            console.log('Getting enrollment status:', {
                studentId: req.user._id,
                courseId: req.params.courseId
            });

            const enrollment = await enrollmentService.getEnrollmentStatus(
                req.user._id,
                req.params.courseId
            );

            res.json({
                success: true,
                data: enrollment
            });
        } catch (error) {
            console.error('Get enrollment status error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async getStudentEnrollments(req, res) {
        try {
            console.log('Getting student enrollments:', req.user._id);

            const enrollments = await enrollmentService.getStudentEnrollments(req.user._id);

            res.json({
                success: true,
                data: enrollments
            });
        } catch (error) {
            console.error('Get student enrollments error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new EnrollmentController(); 