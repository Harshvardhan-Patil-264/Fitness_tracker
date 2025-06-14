const Goal = require('../models/Goal');
const Workout = require('../models/Workout');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      user: req.user._id
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error creating goal', error: error.message });
  }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id })
      .sort({ endDate: 1 });

    // Check and update goal statuses
    const updatedGoals = await Promise.all(goals.map(async (goal) => {
      // If progress equals or exceeds target, mark as completed
      if (goal.progress >= goal.target && goal.status !== 'completed') {
        goal.status = 'completed';
        goal.progress = 100;
        await goal.save();
      }
      return goal;
    }));

    console.log('Fetched goals:', {
      total: updatedGoals.length,
      active: updatedGoals.filter(g => g.status === 'active').length,
      completed: updatedGoals.filter(g => g.status === 'completed').length
    });

    res.json(updatedGoals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};

// Get goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error: error.message });
  }
};

// Update goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Error updating goal', error: error.message });
  }
};

// Delete goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error: error.message });
  }
};

// Update goal progress
exports.updateProgress = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Calculate progress based on goal type
    let progress = 0;
    const now = new Date();
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    switch (goal.type) {
      case 'workout_frequency':
        const workouts = await Workout.countDocuments({
          user: req.user._id,
          date: { $gte: startDate, $lte: now }
        });
        progress = (workouts / goal.target) * 100;
        break;

      case 'calories_burned':
        const caloriesResult = await Workout.aggregate([
          {
            $match: {
              user: req.user._id,
              date: { $gte: startDate, $lte: now }
            }
          },
          {
            $group: {
              _id: null,
              totalCalories: { $sum: '$caloriesBurned' }
            }
          }
        ]);
        const totalCalories = caloriesResult[0]?.totalCalories || 0;
        progress = (totalCalories / goal.target) * 100;
        break;

      case 'weight_loss':
        // For weight loss, progress is directly set
        progress = req.body.progress || goal.progress;
        break;

      default:
        progress = req.body.progress || goal.progress;
    }

    // Update goal status
    let status = goal.status;
    
    // Check if goal is completed based on progress and target
    if (progress >= 100 || (goal.progress >= goal.target)) {
      status = 'completed';
      progress = 100; // Cap progress at 100%
    } else if (now > endDate && progress < 100) {
      status = 'failed';
    }

    // Update goal
    goal.progress = progress;
    goal.status = status;
    await goal.save();

    console.log('Updated goal:', {
      id: goal._id,
      type: goal.type,
      target: goal.target,
      progress: goal.progress,
      status: goal.status
    });

    res.json(goal);
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ message: 'Error updating goal progress', error: error.message });
  }
};

// Get goal statistics
exports.getGoalStats = async (req, res) => {
  try {
    const stats = await Goal.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalProgress: { $avg: '$progress' }
        }
      }
    ]);

    const formattedStats = {
      active: { count: 0, averageProgress: 0 },
      completed: { count: 0, averageProgress: 0 },
      failed: { count: 0, averageProgress: 0 }
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = {
        count: stat.count,
        averageProgress: stat.totalProgress
      };
    });

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal statistics', error: error.message });
  }
}; 