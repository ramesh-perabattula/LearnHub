const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/user
// @desc    Get user dashboard statistics
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title');
    
    const certificates = await Certificate.find({ user: req.user._id });
    
    const enrolledCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.completed).length;
    const inProgressCourses = enrolledCourses - completedCourses;
    const certificatesEarned = certificates.length;

    // Calculate total learning hours (mock calculation)
    const totalLearningHours = completedCourses * 4; // Assume 4 hours per course

    // Recent activities
    const recentActivities = enrollments
      .slice(0, 5)
      .map(enrollment => ({
        type: enrollment.completed ? 'course_completed' : 'course_enrolled',
        courseTitle: enrollment.course.title,
        date: enrollment.completed ? enrollment.completedAt : enrollment.enrolledAt
      }));

    res.json({
      success: true,
      data: {
        enrolledCourses,
        completedCourses,
        inProgressCourses,
        certificatesEarned,
        totalLearningHours,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/teacher
// @desc    Get teacher dashboard statistics
// @access  Private/Teacher
router.get('/teacher', auth, authorize('teacher'), async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id });
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents, 0);
    
    // Mock revenue calculation (in production, you'd have a pricing system)
    const totalRevenue = totalStudents * 50; // Assume $50 per enrollment
    
    // Mock average rating
    const avgRating = 4.7;

    // Recent enrollments
    const recentEnrollments = await Enrollment.find({
      course: { $in: courses.map(c => c._id) }
    })
    .populate('user', 'name')
    .populate('course', 'title')
    .sort({ enrolledAt: -1 })
    .limit(5);

    const formattedRecentEnrollments = recentEnrollments.map(enrollment => ({
      studentName: enrollment.user.name,
      courseTitle: enrollment.course.title,
      enrolledAt: enrollment.enrolledAt
    }));

    // Course performance
    const coursePerformance = courses.map(course => {
      const enrollments = course.enrolledStudents;
      const completionRate = Math.floor(Math.random() * 30) + 70; // Mock completion rate 70-100%
      
      return {
        courseId: course._id,
        courseTitle: course.title,
        enrolledStudents: enrollments,
        completionRate
      };
    });

    res.json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalRevenue,
        avgRating,
        recentEnrollments: formattedRecentEnrollments,
        coursePerformance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/admin', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'user' });
    const totalCourses = await Course.countDocuments({ isActive: true });
    const totalEnrollments = await Enrollment.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    // Mock platform revenue
    const platformRevenue = totalEnrollments * 50;

    // Mock monthly growth percentages
    const monthlyGrowth = {
      users: 12.5,
      courses: 8.3,
      revenue: 15.7
    };

    // Recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt');

    const recentCourses = await Course.find({ isActive: true })
      .populate('teacher', 'name')
      .sort({ createdAt: -1 })
      .limit(2)
      .select('title teacher createdAt');

    const recentActivities = [
      ...recentUsers.map(user => ({
        type: 'new_user',
        userName: user.name,
        date: user.createdAt
      })),
      ...recentCourses.map(course => ({
        type: 'course_created',
        courseTitle: course.title,
        teacherName: course.teacher.name,
        date: course.createdAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalCertificates,
        platformRevenue,
        monthlyGrowth,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;