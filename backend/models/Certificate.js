const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  certificateUrl: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

certificateSchema.pre('save', function(next) {
  if (!this.verificationCode) {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.verificationCode = `LH-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);