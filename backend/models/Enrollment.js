const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Update course enrolled students count when enrollment is created
enrollmentSchema.post('save', async function() {
  const Course = mongoose.model('Course');
  const enrollmentCount = await mongoose.model('Enrollment').countDocuments({ 
    course: this.course 
  });
  await Course.findByIdAndUpdate(this.course, { 
    enrolledStudents: enrollmentCount 
  });
});

// Update course enrolled students count when enrollment is deleted
enrollmentSchema.post('remove', async function() {
  const Course = mongoose.model('Course');
  const enrollmentCount = await mongoose.model('Enrollment').countDocuments({ 
    course: this.course 
  });
  await Course.findByIdAndUpdate(this.course, { 
    enrolledStudents: enrollmentCount 
  });
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);