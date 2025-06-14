const mongoose = require('mongoose');

const workoutSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['strength', 'cardio', 'flexibility', 'balance'],
    default: 'strength'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  tags: [{
    type: String,
    trim: true
  }],
  targetAudience: {
    type: String,
    enum: ['all', 'beginner', 'intermediate', 'advanced'],
    default: 'all'
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
workoutSuggestionSchema.index({ isActive: 1, priority: -1, createdAt: -1 });

const WorkoutSuggestion = mongoose.model('WorkoutSuggestion', workoutSuggestionSchema);

module.exports = WorkoutSuggestion; 