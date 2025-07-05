const Course = require('../models/Course');

exports.searchCourses = async (req, res) => {
  try {
    const {
      q,
      category,
      level,
      price_min,
      price_max,
      page = 1,
      limit = 10
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const query = {
      isActive: true,
      $text: { $search: q }
    };

    if (category) query.category = category;
    if (level) query.level = level;
    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = parseFloat(price_min);
      if (price_max) query.price.$lte = parseFloat(price_max);
    }

    const courses = await Course.find(query)
      .populate('teacher', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 });

    const totalResults = await Course.countDocuments(query);

    const formattedCourses = courses.map(course => ({
      id: course._id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      teacherName: course.teacher.name,
      price: course.price,
      rating: course.rating,
      enrolledStudents: course.enrolledStudents
    }));

    res.json({
      success: true,
      data: {
        courses: formattedCourses,
        totalResults,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalResults / limit),
          per_page: parseInt(limit)
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