const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Course thumbnail is required']
  },
  videoUrl: {
    type: String,
    required: [true, 'Course video URL is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: String,
    default: '1 hour'
  },
  price: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  syllabus: [{
    title: String,
    duration: String
  }]
}, {
  timestamps: true
});

// Index for search functionality
courseSchema.index({ title: 'text', description: 'text' });

// Virtual for teacher name
courseSchema.virtual('teacherName', {
  ref: 'User',
  localField: 'teacher',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);