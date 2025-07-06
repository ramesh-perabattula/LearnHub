const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const enrollmentsController = require('../controllers/enrollmentsController');

const router = express.Router();

router.post('/', auth, enrollmentsController.enrollInCourse);

router.get('/user', auth, enrollmentsController.getUserEnrollments);

router.put('/:id/complete', auth, enrollmentsController.completeEnrollment);

router.put('/:id/progress', auth, enrollmentsController.updateEnrollmentProgress);

module.exports = router;