const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId
    });

    await Notification.create({
      user: req.user._id,
      type: 'course_enrolled',
      title: 'Course Enrollment',
      message: `You have successfully enrolled in "${course.title}"`,
      data: {
        courseId: course._id,
        courseTitle: course.title
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: enrollment._id,
        userId: enrollment.user,
        courseId: enrollment.course,
        enrolledAt: enrollment.enrolledAt,
        completed: enrollment.completed,
        completedAt: enrollment.completedAt,
        progress: enrollment.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      })
      .sort({ enrolledAt: -1 });

    const formattedEnrollments = enrollments.map(enrollment => ({
      id: enrollment._id,
      userId: enrollment.user,
      courseId: enrollment.course._id,
      enrolledAt: enrollment.enrolledAt,
      completed: enrollment.completed,
      completedAt: enrollment.completedAt,
      progress: enrollment.progress,
      course: {
        id: enrollment.course._id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        thumbnail: enrollment.course.thumbnail,
        teacherName: enrollment.course.teacher.name
      }
    }));

    res.json({
      success: true,
      data: {
        enrollments: formattedEnrollments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.completeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (enrollment.completed) {
      return res.status(400).json({
        success: false,
        message: 'Course already completed'
      });
    }

    enrollment.completed = true;
    enrollment.completedAt = new Date();
    enrollment.progress = 100;
    await enrollment.save();

    await Notification.create({
      user: req.user._id,
      type: 'course_completed',
      title: 'Course Completed!',
      message: `Congratulations! You've completed "${enrollment.course.title}"`,
      data: {
        courseId: enrollment.course._id,
        courseTitle: enrollment.course.title
      }
    });

    res.json({
      success: true,
      data: {
        id: enrollment._id,
        userId: enrollment.user,
        courseId: enrollment.course._id,
        enrolledAt: enrollment.enrolledAt,
        completed: enrollment.completed,
        completedAt: enrollment.completedAt,
        progress: enrollment.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateEnrollmentProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.progress = progress;
    enrollment.lastAccessed = new Date();
    
    if (progress === 100 && !enrollment.completed) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.json({
      success: true,
      data: {
        id: enrollment._id,
        userId: enrollment.user,
        courseId: enrollment.course,
        enrolledAt: enrollment.enrolledAt,
        completed: enrollment.completed,
        completedAt: enrollment.completedAt,
        progress: enrollment.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 