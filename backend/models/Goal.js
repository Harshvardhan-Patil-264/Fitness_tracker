const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['workout_frequency', 'calories_burned', 'weight_loss', 'strength', 'endurance', 'custom']
  },
  target: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['workouts', 'calories', 'kg', 'reps', 'minutes', 'custom']
  },
  timeframe: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  },
  description: String,
  customType: String,  // For custom goal types
  customUnit: String,  // For custom units
  milestones: [{
    target: Number,
    achieved: Boolean,
    date: Date
  }]
}, {
  timestamps: true
});

// Index for efficient querying
goalSchema.index({ user: 1, status: 1, endDate: 1 });

module.exports = mongoose.model('Goal', goalSchema); 