const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['wellness', 'nutrition', 'exercise', 'recovery', 'mental'],
    default: 'wellness'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  targetAudience: {
    type: String,
    enum: ['all', 'beginner', 'intermediate', 'advanced'],
    default: 'all'
  },
  relatedWorkouts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
healthTipSchema.index({ isActive: 1, priority: -1, createdAt: -1 });

// Virtual for formatted dates
healthTipSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toISOString();
});

healthTipSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toISOString();
});

// Update the updatedAt timestamp before saving
healthTipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const HealthTip = mongoose.model('HealthTip', healthTipSchema);

module.exports = HealthTip; 