const Course = require('../../courses/models/courseModel');
const Video = require('../../videos/models/videoModel');
const { buildSearchQuery, buildSortOptions } = require('../utils/searchUtils');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const mongoose = require('mongoose');
const Quiz = require('../../quizzes/models/quizModel');
const Enrollment = require('../../courses/models/enrollmentModel');

class DashboardController {
    // Get all courses without search
    async getAllCourses(req, res) {
        try {
            const { page = 1, limit = 10, category, difficultyLevel } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            console.log('Fetching all courses with filters:', { category, difficultyLevel });

            const query = {};
            if (category) {
                query.category = category;
            }
            if (difficultyLevel) {
                query.difficultyLevel = difficultyLevel;
            }

            // Apply filters to the query
            const courses = await Course.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(validLimit)
                .populate('instructor', 'firstName lastName');

            console.log('Found courses:', courses);

            const totalItems = await Course.countDocuments(query);

            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: courses,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error getting courses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get courses'
            });
        }
    }

    // Search courses
    async searchCourses(req, res) {
        try {
            const { search, page = 1, limit = 10, ...filters } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            const query = {
                title: { $regex: search, $options: 'i' }
            };

            if (filters.category) {
                query.category = filters.category;
            }
            if (filters.difficultyLevel) {
                query.difficultyLevel = filters.difficultyLevel;
            }

            console.log('Search query:', query);

            const courses = await Course.find(query)
                .sort(buildSortOptions(filters.sortBy, filters.sortOrder))
                .skip(skip)
                .limit(validLimit)
                .populate('instructor', 'firstName lastName');

            const totalItems = await Course.countDocuments(query);
            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: courses,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error searching courses:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search courses'
            });
        }
    }

    // Get all videos without search
    async getAllVideos(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            console.log('Fetching all videos...');

            // Remove isPublished filter temporarily for testing
            const videos = await Video.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(validLimit)
                .populate('uploadedBy', 'firstName lastName');

            console.log('Found videos:', videos);

            const totalItems = await Video.countDocuments();
            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: videos,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error getting videos:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get videos'
            });
        }
    }

    // Search videos
    async searchVideos(req, res) {
        try {
            const { search, page = 1, limit = 10, ...filters } = req.query;
            const { skip, limit: validLimit } = getPaginationParams(page, limit);

            const query = {
                title: { $regex: search, $options: 'i' }
            };

            if (filters.category) {
                query.category = filters.category;
            }

            console.log('Search query:', query);

            const videos = await Video.find(query)
                .sort(buildSortOptions(filters.sortBy, filters.sortOrder))
                .skip(skip)
                .limit(validLimit)
                .populate('uploadedBy', 'firstName lastName');

            const totalItems = await Video.countDocuments(query);
            const paginationData = getPaginationMetadata(totalItems, page, validLimit);

            res.json({
                success: true,
                data: videos,
                pagination: paginationData
            });
        } catch (error) {
            console.error('Error searching videos:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to search videos'
            });
        }
    }

    // Get course by ID
    async getCourseById(req, res) {
        try {
            console.log('Getting course with ID:', req.params.id);
            
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid course ID format'
                });
            }

            const course = await Course.findById(req.params.id)
                .populate('instructor', 'firstName lastName email')
                .populate({
                    path: 'sequence',
                    populate: [{
                        path: 'contentId',
                        model: 'Video',
                        select: 'title duration description thumbnail url'
                    }, {
                        path: 'contentId',
                        model: 'Quiz',
                        select: 'title description questions'
                    }]
                });

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Get enrollment status for the student
            const enrollment = await Enrollment.findOne({
                student: req.user._id,
                course: course._id
            });

            // Format the content array from sequence
            const formattedContent = course.sequence
                .filter(item => item.contentId) // Only include items with contentId
                .map(item => ({
                    _id: item.contentId._id || item.contentId,
                    contentId: item.contentId._id || item.contentId,
                    title: item.contentId?.title || item.title,
                    type: item.contentType,
                    duration: item.contentId?.duration || item.duration,
                    description: item.contentId?.description,
                    thumbnail: item.contentType === 'video' ? item.contentId?.thumbnail : null,
                    url: item.contentType === 'video' ? item.contentId?.url : null
                }));

            const responseData = {
                ...course.toObject(),
                content: formattedContent,
                isEnrolled: !!enrollment,
                progress: enrollment?.progress || 0
            };

            res.json({
                success: true,
                data: responseData
            });
        } catch (error) {
            console.error('Error getting course:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get course'
            });
        }
    }

    // Get video by ID
    async getVideoById(req, res) {
        try {
            console.log('Getting video with ID:', req.params.id);

            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid video ID format'
                });
            }

            const video = await Video.findById(req.params.id)
                .populate('uploadedBy', 'firstName lastName email')
                .select('title description duration thumbnail url uploadedBy createdAt');

            console.log('Video query result:', video);

            if (!video) {
                return res.status(404).json({
                    success: false,
                    message: 'Video not found'
                });
            }

            // Convert to plain object and send
            const videoData = video.toObject();
            console.log('Sending video data:', videoData);
            res.json(videoData);
        } catch (error) {
            console.error('Error getting video:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get video'
            });
        }
    }

    // Get quiz by ID
    async getQuizById(req, res) {
        try {
            console.log('Getting quiz with ID:', req.params.id);

            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid quiz ID format'
                });
            }

            const quiz = await Quiz.findById(req.params.id)
                .populate('instructor', 'firstName lastName email')
                .select('title description questions createdAt courseId instructor');

            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    message: 'Quiz not found'
                });
            }

            // Get enrollment status and previous attempts
            let isEnrolled = false;
            let progress = null;
            let previousAttempt = null;

            if (quiz.courseId) {
                const enrollment = await Enrollment.findOne({
                    student: req.user._id,
                    course: quiz.courseId
                });
                
                if (enrollment) {
                    isEnrolled = true;
                    const contentProgress = enrollment.contentProgress.find(
                        p => p.contentId.toString() === req.params.id
                    );
                    if (contentProgress) {
                        progress = {
                            progress: contentProgress.progress,
                            completed: contentProgress.completed,
                            score: contentProgress.score
                        };
                        previousAttempt = contentProgress.completed;
                    }
                }
            }

            // Format questions based on whether the quiz is completed
            const formattedQuestions = quiz.questions.map(q => ({
                _id: q._id,
                question: q.question,
                options: q.options,
                // Only include correct answer if quiz is completed
                ...(previousAttempt && { correctAnswer: q.correctAnswer })
            }));

            const response = {
                ...quiz.toObject(),
                questions: formattedQuestions,
                isEnrolled,
                progress,
                completed: previousAttempt
            };

            res.json({
                success: true,
                data: response
            });
        } catch (error) {
            console.error('Error getting quiz:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get quiz'
            });
        }
    }

    // Submit quiz attempt
    async submitQuizAttempt(req, res) {
        try {
            const { quizId } = req.params;
            const { answers } = req.body;

            console.log('Submitting quiz attempt:', { quizId, answers });

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    message: 'Quiz not found'
                });
            }

            // Calculate score
            let correctAnswers = 0;
            const totalQuestions = quiz.questions.length;

            Object.entries(answers).forEach(([questionIndex, answer]) => {
                if (quiz.questions[questionIndex].correctAnswer === answer) {
                    correctAnswers++;
                }
            });

            const score = Math.round((correctAnswers / totalQuestions) * 100);

            // Update enrollment progress if quiz is part of a course
            if (quiz.courseId) {
                const enrollment = await Enrollment.findOne({
                    student: req.user._id,
                    course: quiz.courseId
                });

                if (enrollment) {
                    const contentProgress = enrollment.contentProgress.find(
                        p => p.contentId.toString() === quizId
                    );

                    if (contentProgress) {
                        contentProgress.progress = 100;
                        contentProgress.completed = true;
                        contentProgress.score = score;
                        contentProgress.lastAccessedAt = new Date();
                    } else {
                        enrollment.contentProgress.push({
                            contentId: quizId,
                            contentModel: 'Quiz',
                            progress: 100,
                            completed: true,
                            score,
                            lastAccessedAt: new Date()
                        });
                    }

                    // Recalculate overall course progress
                    const completedContent = enrollment.contentProgress.filter(p => p.completed).length;
                    const totalContent = enrollment.course.sequence.length;
                    enrollment.progress = Math.round((completedContent / totalContent) * 100);
                    enrollment.isCompleted = enrollment.progress === 100;

                    await enrollment.save();
                }
            }

            // Return quiz results with correct answers
            const results = {
                score,
                correctAnswers,
                totalQuestions,
                questions: quiz.questions.map(q => ({
                    _id: q._id,
                    question: q.question,
                    correctAnswer: q.correctAnswer,
                    yourAnswer: answers[quiz.questions.indexOf(q)]
                }))
            };

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit quiz'
            });
        }
    }

    // Get quiz progress
    async getQuizProgress(req, res) {
        try {
            const { quizId } = req.params;

            console.log('Getting quiz progress:', { quizId, userId: req.user._id });

            // Find quiz
            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    message: 'Quiz not found'
                });
            }

            // If quiz is part of a course, get progress from enrollment
            if (quiz.courseId) {
                const enrollment = await Enrollment.findOne({
                    student: req.user._id,
                    course: quiz.courseId
                });

                if (enrollment) {
                    const contentProgress = enrollment.contentProgress.find(
                        p => p.contentId.toString() === quizId
                    );

                    if (contentProgress) {
                        return res.json({
                            success: true,
                            data: {
                                progress: contentProgress.progress,
                                completed: contentProgress.completed,
                                score: contentProgress.score,
                                lastAccessedAt: contentProgress.lastAccessedAt
                            }
                        });
                    }
                }
            }

            // If no progress found, return default values
            res.json({
                success: true,
                data: {
                    progress: 0,
                    completed: false,
                    score: null,
                    lastAccessedAt: null
                }
            });
        } catch (error) {
            console.error('Error getting quiz progress:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get quiz progress'
            });
        }
    }

    // Update progress
    async updateProgress(req, res) {
        try {
            const { courseId, contentId } = req.params;
            const { progress, completed, contentType } = req.body;

            const enrollment = await Enrollment.findOne({
                student: req.user._id,
                course: courseId
            });

            if (!enrollment) {
                return res.status(404).json({
                    success: false,
                    message: 'Enrollment not found'
                });
            }

            // Update content progress
            const contentProgressIndex = enrollment.contentProgress.findIndex(
                p => p.contentId.toString() === contentId
            );

            if (contentProgressIndex !== -1) {
                enrollment.contentProgress[contentProgressIndex] = {
                    ...enrollment.contentProgress[contentProgressIndex],
                    progress,
                    completed,
                    lastAccessedAt: new Date()
                };
            } else {
                enrollment.contentProgress.push({
                    contentId,
                    contentModel: contentType === 'video' ? 'Video' : 'Quiz',
                    progress,
                    completed,
                    lastAccessedAt: new Date()
                });
            }

            // Calculate overall course progress
            const course = await Course.findById(courseId);
            const totalContent = course.sequence.length;
            const completedContent = enrollment.contentProgress.filter(p => p.completed).length;
            const inProgressContent = enrollment.contentProgress
                .filter(p => !p.completed && p.progress > 0)
                .reduce((sum, content) => sum + content.progress, 0) / 100;

            // Calculate weighted progress
            enrollment.progress = Math.round(
                ((completedContent + inProgressContent) / totalContent) * 100
            );

            // Update completion status
            enrollment.isCompleted = enrollment.progress === 100;
            
            await enrollment.save();

            res.json({
                success: true,
                data: {
                    contentProgress: enrollment.contentProgress.find(p => p.contentId.toString() === contentId),
                    overallProgress: enrollment.progress,
                    isCompleted: enrollment.isCompleted
                }
            });
        } catch (error) {
            console.error('Error updating progress:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update progress'
            });
        }
    }
}

module.exports = new DashboardController(); 