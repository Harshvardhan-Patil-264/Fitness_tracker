const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalWorkouts: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0
  },
  workoutTypeDistribution: [{
    name: String,
    value: Number
  }],
  weeklyActivity: [{
    day: String,
    workouts: Number,
    duration: Number
  }],
  progressOverTime: [{
    date: String,
    caloriesBurned: Number,
    duration: Number
  }],
  goalCompletionRate: [{
    type: String,
    completed: Number,
    total: Number
  }],
  mostCommonExercises: [{
    name: String,
    count: Number
  }]
}, {
  timestamps: true
});

// Index for efficient querying
analyticsSchema.index({ user: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 