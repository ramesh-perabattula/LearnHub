const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { auth, authorize } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validateCourse');
const coursesController = require('../controllers/coursesController');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', coursesController.getCourses);

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', coursesController.getCourseById);

// @route   POST /api/courses
// @desc    Create new course
// @access  Private/Teacher
router.post('/', auth, authorize('teacher', 'admin'), validateCourse, coursesController.createCourse);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Teacher/Admin
router.put('/:id', auth, authorize('teacher', 'admin'), validateCourse, coursesController.updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Teacher/Admin
router.delete('/:id', auth, authorize('teacher', 'admin'), coursesController.deleteCourse);

// @route   GET /api/courses/teacher/my-courses
// @desc    Get courses created by current teacher
// @access  Private/Teacher
router.get('/teacher/my-courses', auth, authorize('teacher'), coursesController.getMyCourses);

module.exports = router;