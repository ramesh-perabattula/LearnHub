const { validationResult } = require('express-validator');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const category = req.query.category;

    const query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate('teacher', 'name avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    // Format response to match frontend expectations
    const formattedCourses = courses.map(course => ({
      id: course._id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      videoUrl: course.videoUrl,
      teacherId: course.teacher._id,
      teacherName: course.teacher.name,
      teacherAvatar: course.teacher.avatar,
      enrolledStudents: course.enrolledStudents,
      duration: course.duration,
      level: course.level,
      category: course.category,
      price: course.price,
      rating: course.rating,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    res.json({
      success: true,
      data: {
        courses: formattedCourses,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_courses: total,
          per_page: limit
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

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name avatar');

    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const formattedCourse = {
      id: course._id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      videoUrl: course.videoUrl,
      teacherId: course.teacher._id,
      teacherName: course.teacher.name,
      teacherAvatar: course.teacher.avatar,
      enrolledStudents: course.enrolledStudents,
      duration: course.duration,
      level: course.level,
      category: course.category,
      price: course.price,
      rating: course.rating,
      syllabus: course.syllabus,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    };

    res.json({
      success: true,
      data: formattedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const courseData = {
      ...req.body,
      teacher: req.user._id
    };

    const course = await Course.create(courseData);
    await course.populate('teacher', 'name avatar');

    const formattedCourse = {
      id: course._id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      videoUrl: course.videoUrl,
      teacherId: course.teacher._id,
      teacherName: course.teacher.name,
      teacherAvatar: course.teacher.avatar,
      enrolledStudents: course.enrolledStudents,
      duration: course.duration,
      level: course.level,
      category: course.category,
      price: course.price,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    };

    res.status(201).json({
      success: true,
      data: formattedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course teacher or admin
    if (req.user.role !== 'admin' && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('teacher', 'name avatar');

    const formattedCourse = {
      id: updatedCourse._id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      thumbnail: updatedCourse.thumbnail,
      videoUrl: updatedCourse.videoUrl,
      teacherId: updatedCourse.teacher._id,
      teacherName: updatedCourse.teacher.name,
      enrolledStudents: updatedCourse.enrolledStudents,
      createdAt: updatedCourse.createdAt,
      updatedAt: updatedCourse.updatedAt
    };

    res.json({
      success: true,
      data: formattedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course teacher or admin
    if (req.user.role !== 'admin' && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    // Delete related enrollments
    await Enrollment.deleteMany({ course: req.params.id });

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: {
        message: 'Course deleted successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 