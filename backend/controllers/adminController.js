const User = require('../models/User');
const Workout = require('../models/Workout');
const Goal = require('../models/Goal');
const Analytics = require('../models/Analytics');
const HealthTip = require('../models/HealthTip');

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating sensitive fields
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated data
    await Promise.all([
      Workout.deleteMany({ user: id }),
      Goal.deleteMany({ user: id }),
      Analytics.deleteMany({ user: id })
    ]);

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// System Analytics
exports.getSystemAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalWorkouts,
      totalGoals,
      activeUsers,
      recentWorkouts
    ] = await Promise.all([
      User.countDocuments(),
      Workout.countDocuments(),
      Goal.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Workout.find().sort({ date: -1 }).limit(10).populate('user', 'username')
    ]);

    const workoutStats = await Workout.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' }
        }
      }
    ]);

    const goalStats = await Goal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          averageProgress: { $avg: '$progress' }
        }
      }
    ]);

    res.json({
      userStats: {
        totalUsers,
        activeUsers,
        activeUserPercentage: (activeUsers / totalUsers) * 100
      },
      workoutStats: {
        totalWorkouts,
        byType: workoutStats
      },
      goalStats: {
        totalGoals,
        byStatus: goalStats
      },
      recentActivity: recentWorkouts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system analytics', error: error.message });
  }
};

// Health Tips Management
exports.createHealthTip = async (req, res) => {
  try {
    const healthTip = new HealthTip({
      ...req.body,
      createdBy: req.user._id
    });
    await healthTip.save();
    res.status(201).json(healthTip);
  } catch (error) {
    res.status(400).json({ message: 'Error creating health tip', error: error.message });
  }
};

exports.updateHealthTip = async (req, res) => {
  try {
    const { id } = req.params;
    const healthTip = await HealthTip.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    res.json(healthTip);
  } catch (error) {
    res.status(400).json({ message: 'Error updating health tip', error: error.message });
  }
};

exports.deleteHealthTip = async (req, res) => {
  try {
    const { id } = req.params;
    const healthTip = await HealthTip.findByIdAndDelete(id);
    
    if (!healthTip) {
      return res.status(404).json({ message: 'Health tip not found' });
    }

    res.json({ message: 'Health tip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting health tip', error: error.message });
  }
};

exports.getAllHealthTips = async (req, res) => {
  try {
    const { category, isActive, targetAudience } = req.query;
    const query = {};

    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive;
    if (targetAudience) query.targetAudience = targetAudience;

    const healthTips = await HealthTip.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .populate('createdBy', 'username');

    res.json(healthTips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching health tips', error: error.message });
  }
}; 