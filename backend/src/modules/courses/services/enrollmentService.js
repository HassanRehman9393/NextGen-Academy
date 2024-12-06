const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');

class EnrollmentService {
    async enrollStudent(studentId, courseId) {
        try {
            console.log('Enrolling student:', studentId, 'in course:', courseId);

            // Check if already enrolled
            const existingEnrollment = await Enrollment.findOne({
                student: studentId,
                course: courseId
            });

            if (existingEnrollment) {
                throw new Error('Student is already enrolled in this course');
            }

            // Get course to initialize content progress
            const course = await Course.findById(courseId);
            if (!course) {
                throw new Error('Course not found');
            }

            // Initialize content progress for each item in course sequence
            const initialContentProgress = course.sequence.map(item => ({
                contentId: item.contentId,
                contentModel: item.contentModel,
                progress: 0,
                completed: false
            }));

            // Create new enrollment
            const enrollment = new Enrollment({
                student: studentId,
                course: courseId,
                contentProgress: initialContentProgress
            });

            console.log('Created enrollment:', enrollment);
            await enrollment.save();
            return enrollment;
        } catch (error) {
            console.error('Error in enrollStudent:', error);
            throw error;
        }
    }

    async updateProgress(studentId, courseId, contentId, progressData) {
        try {
            console.log('Updating progress:', { studentId, courseId, contentId, progressData });

            const enrollment = await Enrollment.findOne({
                student: studentId,
                course: courseId
            });

            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            // Find and update content progress
            const contentProgressIndex = enrollment.contentProgress.findIndex(
                p => p.contentId.toString() === contentId
            );

            if (contentProgressIndex !== -1) {
                enrollment.contentProgress[contentProgressIndex] = {
                    ...enrollment.contentProgress[contentProgressIndex],
                    progress: progressData.progress,
                    completed: progressData.completed,
                    lastAccessedAt: new Date()
                };
            }

            // Calculate overall course progress
            const completedContent = enrollment.contentProgress.filter(p => p.completed).length;
            const totalContent = enrollment.contentProgress.length;
            enrollment.progress = Math.round((completedContent / totalContent) * 100);

            // Check if course is completed
            enrollment.isCompleted = enrollment.progress === 100;
            enrollment.lastAccessedAt = new Date();

            console.log('Updated enrollment:', enrollment);
            await enrollment.save();
            return enrollment;
        } catch (error) {
            console.error('Error in updateProgress:', error);
            throw error;
        }
    }

    async getEnrollmentStatus(studentId, courseId) {
        try {
            console.log('Getting enrollment status:', { studentId, courseId });

            const enrollment = await Enrollment.findOne({
                student: studentId,
                course: courseId
            })
            .populate('contentProgress.contentId')
            .populate('course');

            console.log('Found enrollment:', enrollment);
            return enrollment;
        } catch (error) {
            console.error('Error in getEnrollmentStatus:', error);
            throw error;
        }
    }

    async getStudentEnrollments(studentId) {
        try {
            console.log('Getting all enrollments for student:', studentId);

            const enrollments = await Enrollment.find({ student: studentId })
                .populate('course')
                .sort('-lastAccessedAt');

            console.log('Found enrollments:', enrollments.length);
            return enrollments;
        } catch (error) {
            console.error('Error in getStudentEnrollments:', error);
            throw error;
        }
    }

    async isEnrolled(studentId, courseId) {
        try {
            const enrollment = await Enrollment.findOne({
                student: studentId,
                course: courseId
            });
            return !!enrollment;
        } catch (error) {
            console.error('Error checking enrollment:', error);
            throw error;
        }
    }
}

module.exports = new EnrollmentService(); 