const Course = require('../models/courseModel');
const Video = require('../../videos/models/videoModel');
const Quiz = require('../../quizzes/models/quizModel');
const SequenceUtils = require('../utils/sequenceUtils');
const { validateCourse } = require('../utils/validation');

class CourseService {
    async createCourse(courseData, instructorId) {
        const { error } = validateCourse(courseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        try {
            const course = new Course({
                ...courseData,
                instructor: instructorId
            });
            return await course.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('A course with this title already exists');
            }
            throw error;
        }
    }

    async getCoursesByInstructor(instructorId) {
        return await Course.find({ instructor: instructorId })
            .populate('instructor', 'name email')
            .sort('-createdAt');
    }

    async getCourseById(courseId, instructorId) {
        const course = await Course.findOne({
            _id: courseId,
            instructor: instructorId
        }).populate('instructor', 'name email');

        if (!course) {
            throw new Error('Course not found or you do not have permission to access it');
        }

        return course;
    }

    async updateCourse(courseId, courseData, instructorId) {
        const { error } = validateCourse(courseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const course = await this.getCourseById(courseId, instructorId);
        
        if (courseData.sequence) {
            const sequenceValidation = await SequenceUtils.validateContent(
                courseData.sequence,
                instructorId
            );
            
            if (!sequenceValidation.isValid) {
                throw new Error(sequenceValidation.errors.join(', '));
            }
        }

        Object.assign(course, courseData);
        return await course.save();
    }

    async deleteCourse(courseId, instructorId) {
        const course = await this.getCourseById(courseId, instructorId);
        await Course.findByIdAndDelete(courseId);
    }

    async addContent(courseId, contentData, instructorId) {
        const course = await this.getCourseById(courseId, instructorId);

        if (!course) {
            throw new Error('Course not found');
        }

        // Validate content ownership
        const Model = contentData.contentType === 'video' ? Video : Quiz;
        const content = await Model.findById(contentData.contentId);
        
        if (!content) {
            throw new Error(`${contentData.contentType} not found`);
        }

        // Verify instructor owns the content
        const contentOwner = content.instructor || content.uploadedBy;
        if (contentOwner.toString() !== instructorId.toString()) {
            throw new Error(`You don't own this ${contentData.contentType}`);
        }

        // Add to sequence with proper order
        const maxOrder = course.sequence.length > 0 
            ? Math.max(...course.sequence.map(item => item.order))
            : 0;

        const newContent = {
            contentType: contentData.contentType,
            contentId: content._id,
            contentModel: contentData.contentType === 'video' ? 'Video' : 'Quiz',
            order: maxOrder + 1,
            title: content.title,
            duration: content.duration
        };

        course.sequence.push(newContent);
        
        // Save the updated course
        const updatedCourse = await course.save();
        if (!updatedCourse) {
            throw new Error('Failed to save course with new content');
        }

        return updatedCourse;
    }

    async removeContent(courseId, contentIndex, instructorId) {
        const course = await this.getCourseById(courseId, instructorId);

        if (!course) {
            throw new Error('Course not found');
        }

        if (contentIndex < 0 || contentIndex >= course.sequence.length) {
            throw new Error('Invalid content index');
        }

        // Remove the content at the specified index
        course.sequence.splice(contentIndex, 1);

        // Update the order of remaining items
        course.sequence = course.sequence.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        // Save the updated course
        const updatedCourse = await course.save();
        if (!updatedCourse) {
            throw new Error('Failed to save course after removing content');
        }

        return updatedCourse;
    }

    async reorderContent(courseId, fromIndex, toIndex, instructorId) {
        const course = await this.getCourseById(courseId, instructorId);

        if (fromIndex < 0 || fromIndex >= course.sequence.length ||
            toIndex < 0 || toIndex >= course.sequence.length) {
            throw new Error('Invalid index');
        }

        const newSequence = [...course.sequence];
        const [movedItem] = newSequence.splice(fromIndex, 1);
        newSequence.splice(toIndex, 0, movedItem);

        course.sequence = SequenceUtils.reorderSequence(newSequence);
        return await course.save();
    }
}

module.exports = new CourseService(); 