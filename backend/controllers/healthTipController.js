const HealthTip = require('../models/HealthTip');
const mongoose = require('mongoose');

// Get all health tips (admin only)
exports.getAllHealthTips = async (req, res) => {
  try {
    console.log('Fetching all health tips...');
    const healthTips = await HealthTip.find()
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${healthTips.length} health tips`);
    res.json(healthTips);
  } catch (error) {
    console.error('Error in getAllHealthTips:', error);
    res.status(500).json({ message: 'Error fetching health tips' });
  }
};

// Get active health tips
exports.getActiveHealthTips = async (req, res) => {
  try {
    console.log('Fetching active health tips...');
    const healthTips = await HealthTip.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    console.log(`Found ${healthTips.length} active health tips`);
    res.json(healthTips);
  } catch (error) {
    console.error('Error in getActiveHealthTips:', error);
    res.status(500).json({ message: 'Error fetching active health tips' });
  }
};

// Get single health tip
exports.getHealthTip = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid health tip ID' });
    }

    const healthTip = await HealthTip.findById(req.params.id).lean();
    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    res.json(healthTip);
  } catch (error) {
    console.error('Error in getHealthTip:', error);
    res.status(500).json({ message: 'Error fetching health tip' });
  }
};

// Create health tip (admin only)
exports.createHealthTip = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      targetAudience,
      priority,
      isActive,
    } = req.body;

    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        message: 'Title, content, and category are required',
      });
    }

    // Validate category
    const validCategories = ['wellness', 'nutrition', 'exercise', 'recovery', 'mental'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category. Must be one of: wellness, nutrition, exercise, recovery, mental',
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

    const healthTip = new HealthTip({
      title,
      content,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      targetAudience,
      priority: parseInt(priority) || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id,
    });

    await healthTip.save();
    console.log('Created new health tip:', healthTip._id);
    res.status(201).json(healthTip);
  } catch (error) {
    console.error('Error in createHealthTip:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating health tip' });
  }
};

// Update health tip (admin only)
exports.updateHealthTip = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid health tip ID' });
    }

    const {
      title,
      content,
      category,
      tags,
      targetAudience,
      priority,
      isActive,
    } = req.body;

    // Validate category if provided
    if (category) {
      const validCategories = ['wellness', 'nutrition', 'exercise', 'recovery', 'mental'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: 'Invalid category. Must be one of: wellness, nutrition, exercise, recovery, mental',
        });
      }
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
      ...(content && { content }),
      ...(category && { category }),
      ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag) }),
      ...(targetAudience && { targetAudience }),
      ...(priority !== undefined && { priority: parseInt(priority) }),
      ...(isActive !== undefined && { isActive }),
    };

    const healthTip = await HealthTip.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    console.log('Updated health tip:', healthTip._id);
    res.json(healthTip);
  } catch (error) {
    console.error('Error in updateHealthTip:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating health tip' });
  }
};

// Delete health tip (admin only)
exports.deleteHealthTip = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid health tip ID' });
    }

    const healthTip = await HealthTip.findByIdAndDelete(req.params.id);
    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    console.log('Deleted health tip:', healthTip._id);
    res.json({ message: 'Health tip deleted successfully' });
  } catch (error) {
    console.error('Error in deleteHealthTip:', error);
    res.status(500).json({ message: 'Error deleting health tip' });
  }
}; 