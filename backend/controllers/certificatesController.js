const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

exports.getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      })
      .sort({ issuedAt: -1 });

    const formattedCertificates = certificates.map(cert => ({
      id: cert._id,
      userId: cert.user,
      courseId: cert.course._id,
      certificateUrl: cert.certificateUrl,
      issuedAt: cert.issuedAt,
      verificationCode: cert.verificationCode,
      course: {
        id: cert.course._id,
        title: cert.course.title,
        description: cert.course.description,
        teacherName: cert.course.teacher.name
      }
    }));

    res.json({
      success: true,
      data: {
        certificates: formattedCertificates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course is completed
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
      completed: true
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Course not completed or enrollment not found'
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: req.user._id,
      course: courseId
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already generated for this course'
      });
    }

    const course = await Course.findById(courseId);

    // Generate certificate URL (in production, this would be a real PDF generation service)
    const certificateUrl = `https://certificates.learnhub.com/cert_${Date.now()}.pdf`;

    const certificate = await Certificate.create({
      user: req.user._id,
      course: courseId,
      certificateUrl
    });

    // Create notification
    await Notification.create({
      user: req.user._id,
      type: 'certificate_issued',
      title: 'Certificate Issued!',
      message: `Your certificate for "${course.title}" is ready for download`,
      data: {
        courseId: course._id,
        courseTitle: course.title,
        certificateId: certificate._id
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: certificate._id,
        userId: certificate.user,
        courseId: certificate.course,
        certificateUrl: certificate.certificateUrl,
        issuedAt: certificate.issuedAt,
        verificationCode: certificate.verificationCode
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      verificationCode: req.params.verificationCode,
      isValid: true
    })
    .populate('user', 'name')
    .populate({
      path: 'course',
      populate: {
        path: 'teacher',
        select: 'name'
      }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        data: {
          valid: false,
          message: 'Certificate not found or invalid'
        }
      });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        certificate: {
          id: certificate._id,
          userName: certificate.user.name,
          courseTitle: certificate.course.title,
          teacherName: certificate.course.teacher.name,
          issuedAt: certificate.issuedAt,
          verificationCode: certificate.verificationCode
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 