const express = require('express');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');
const certificatesController = require('../controllers/certificatesController');

const router = express.Router();

// @route   GET /api/certificates/user
// @desc    Get current user's certificates
// @access  Private
router.get('/user', auth, certificatesController.getUserCertificates);

// @route   POST /api/certificates/generate
// @desc    Generate certificate for completed course
// @access  Private
router.post('/generate', auth, certificatesController.generateCertificate);

// @route   GET /api/certificates/verify/:verificationCode
// @desc    Verify certificate authenticity
// @access  Public
router.get('/verify/:verificationCode', certificatesController.verifyCertificate);

module.exports = router;