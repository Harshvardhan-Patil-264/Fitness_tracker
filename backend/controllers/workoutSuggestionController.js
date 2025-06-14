const WorkoutSuggestion = require('../models/WorkoutSuggestion');
const mongoose = require('mongoose');

// Get all workout suggestions (admin only)
exports.getAllWorkoutSuggestions = async (req, res) => {
  try {
    const suggestions = await WorkoutSuggestion.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(suggestions);
  } catch (error) {
    console.error('Error in getAllWorkoutSuggestions:', error);
    res.status(500).json({ message: 'Error fetching workout suggestions' });
  }
};

// Get active workout suggestions
exports.getActiveWorkoutSuggestions = async (req, res) => {
  try {
    const suggestions = await WorkoutSuggestion.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    res.json(suggestions);
  } catch (error) {
    console.error('Error in getActiveWorkoutSuggestions:', error);
    res.status(500).json({ message: 'Error fetching active workout suggestions' });
  }
};

// Get single workout suggestion
exports.getWorkoutSuggestion = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid workout suggestion ID' });
    }

    const suggestion = await WorkoutSuggestion.findById(req.params.id).lean();
    if (!suggestion) {
      return res.status(404).json({ message: 'Workout suggestion not found' });
    }

    res.json(suggestion);
  } catch (error) {
    console.error('Error in getWorkoutSuggestion:', error);
    res.status(500).json({ message: 'Error fetching workout suggestion' });
  }
};

// Create workout suggestion (admin only)
exports.createWorkoutSuggestion = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      tags,
      targetAudience,
      priority,
      isActive,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !difficulty || !duration) {
      return res.status(400).json({
        message: 'Title, description, category, difficulty, and duration are required',
      });
    }

    // Validate category
    const validCategories = ['strength', 'cardio', 'flexibility', 'balance'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category. Must be one of: strength, cardio, flexibility, balance',
      });
    }

    // Validate difficulty
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: 'Invalid difficulty. Must be one of: beginner, intermediate, advanced',
      });
    }

    // Validate duration
    if (duration < 1) {
      return res.status(400).json({
        message: 'Duration must be at least 1 minute',
      });
    }

    // Validate target audience
    const validAudiences = ['all', 'beginner', 'intermediate', 'advanced'];
    if (!validAudiences.includes(targetAudience)) {
      return res.status(400).json({
        message: 'Invalid target audience. Must be one of: all, beginner, intermediate, advanced',
      });
    }

    // Validate priority
    if (priority < 0 || priority > 10) {
      return res.status(400).json({
        message: 'Priority must be between 0 and 10',
      });
    }

    const suggestion = new WorkoutSuggestion({
      title,
      description,
      category,
      difficulty,
      duration: parseInt(duration),
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      targetAudience,
      priority: parseInt(priority) || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id,
    });

    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (error) {
    console.error('Error in createWorkoutSuggestion:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating workout suggestion' });
  }
};

// Update workout suggestion (admin only)
exports.updateWorkoutSuggestion = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid workout suggestion ID' });
    }

    const {
      title,
      description,
      category,
      difficulty,
      duration,
      tags,
      targetAudience,
      priority,
      isActive,
    } = req.body;

    // Validate category if provided
    if (category) {
      const validCategories = ['strength', 'cardio', 'flexibility', 'balance'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: 'Invalid category. Must be one of: strength, cardio, flexibility, balance',
        });
      }
    }

    // Validate difficulty if provided
    if (difficulty) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced'];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          message: 'Invalid difficulty. Must be one of: beginner, intermediate, advanced',
        });
      }
    }

    // Validate duration if provided
    if (duration && duration < 1) {
      return res.status(400).json({
        message: 'Duration must be at least 1 minute',
      });
    }

    // Validate target audience if provided
    if (targetAudience) {
      const validAudiences = ['all', 'beginner', 'intermediate', 'advanced'];
      if (!validAudiences.includes(targetAudience)) {
        return res.status(400).json({
          message: 'Invalid target audience. Must be one of: all, beginner, intermediate, advanced',
        });
      }
    }

    // Validate priority if provided
    if (priority !== undefined && (priority < 0 || priority > 10)) {
      return res.status(400).json({
        message: 'Priority must be between 0 and 10',
      });
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(duration && { duration: parseInt(duration) }),
      ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag) }),
      ...(targetAudience && { targetAudience }),
      ...(priority !== undefined && { priority: parseInt(priority) }),
      ...(isActive !== undefined && { isActive }),
    };

    const suggestion = await WorkoutSuggestion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!suggestion) {
      return res.status(404).json({ message: 'Workout suggestion not found' });
    }

    res.json(suggestion);
  } catch (error) {
    console.error('Error in updateWorkoutSuggestion:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating workout suggestion' });
  }
};

// Delete workout suggestion (admin only)
exports.deleteWorkoutSuggestion = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid workout suggestion ID' });
    }

    const suggestion = await WorkoutSuggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ message: 'Workout suggestion not found' });
    }

    res.json({ message: 'Workout suggestion deleted successfully' });
  } catch (error) {
    console.error('Error in deleteWorkoutSuggestion:', error);
    res.status(500).json({ message: 'Error deleting workout suggestion' });
  }
}; 