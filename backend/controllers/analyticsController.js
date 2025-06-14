const Analytics = require('../models/Analytics');
const Workout = require('../models/Workout');
const Goal = require('../models/Goal');
const User = require('../models/User');

// Generate analytics for a user
exports.generateAnalytics = async (req, res) => {
  try {
    console.log('=== Analytics Generation Start ===');
    console.log('User ID:', req.user._id);
    console.log('Request body:', req.body);

    // Validate user
    if (!req.user || !req.user._id) {
      console.error('No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Set default timeRange if not provided
    const timeRange = req.body.timeRange || 'month';
    console.log('Using timeRange:', timeRange);

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        console.log('Invalid timeRange provided, defaulting to month');
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Set time to start/end of day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    console.log('Date range:', { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString() 
    });

    // Initialize analytics object with default values
    const analytics = {
      totalWorkouts: 0,
      totalDuration: 0,
      totalCaloriesBurned: 0,
      workoutTypeDistribution: {},
      weeklyActivity: [],
      progressOverTime: [],
      goalCompletionRate: 0,
      mostCommonExercises: []
    };

    try {
      // Get workout statistics for the time range
      console.log('Fetching workout statistics for date range...');
      const workouts = await Workout.find({
        user: req.user._id,
        date: { 
          $gte: startDate,
          $lte: endDate 
        }
      }).lean();

      console.log('Found workouts in date range:', workouts.length);
      if (workouts.length > 0) {
        console.log('Sample workout:', {
          id: workouts[0]._id,
          date: workouts[0].date,
          type: workouts[0].type,
          duration: workouts[0].duration,
          caloriesBurned: workouts[0].caloriesBurned
        });
      }

      // Calculate workout statistics
      analytics.totalWorkouts = workouts.length;
      analytics.totalDuration = workouts.reduce((sum, workout) => {
        const duration = Number(workout.duration) || 0;
        return sum + duration;
      }, 0);
      
      analytics.totalCaloriesBurned = workouts.reduce((sum, workout) => {
        const calories = Number(workout.caloriesBurned) || 0;
        return sum + calories;
      }, 0);

      // Calculate workout type distribution
      analytics.workoutTypeDistribution = workouts.reduce((acc, workout) => {
        const type = workout.type || 'other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Calculate weekly activity
      console.log('Calculating weekly activity...');
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayWorkouts = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= dayStart && workoutDate <= dayEnd;
        });

        analytics.weeklyActivity.push({
          date: dayStart.toISOString().split('T')[0],
          count: dayWorkouts.length,
          duration: dayWorkouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0),
          caloriesBurned: dayWorkouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0)
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Get goal statistics
      console.log('Fetching goal statistics...');
      const goals = await Goal.find({
        user: req.user._id,
        $or: [
          { endDate: { $gte: startDate, $lte: endDate } },
          { startDate: { $gte: startDate, $lte: endDate } }
        ]
      }).lean();

      console.log('Found goals:', goals.length);
      if (goals.length > 0) {
        console.log('Sample goal:', {
          id: goals[0]._id,
          type: goals[0].type,
          status: goals[0].status,
          progress: goals[0].progress
        });
      }

      // Calculate goal completion rate
      const completedGoals = goals.filter(goal => goal.status === 'completed').length;
      analytics.goalCompletionRate = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

      // Calculate progress over time
      analytics.progressOverTime = analytics.weeklyActivity.map(day => ({
        date: day.date,
        progress: (day.count / analytics.totalWorkouts) * 100
      }));

      // Get most common exercises
      const exerciseCount = {};
      workouts.forEach(workout => {
        if (workout.exercises && Array.isArray(workout.exercises)) {
          workout.exercises.forEach(exercise => {
            if (exercise.name) {
              exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
            }
          });
        }
      });

      analytics.mostCommonExercises = Object.entries(exerciseCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    } catch (dbError) {
      console.error('Database operation error:', dbError);
      throw new Error(`Database operation failed: ${dbError.message}`);
    }

    console.log('Analytics generated successfully');
    console.log('Final analytics:', analytics);
    console.log('=== Analytics Generation End ===');
    
    res.json(analytics);
  } catch (error) {
    console.error('Error in generateAnalytics:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error generating analytics',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get analytics for a specific period
exports.getAnalytics = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    const userId = req.user._id;

    const analytics = await Analytics.findOne({
      user: userId,
      period,
      startDate,
      endDate
    });

    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found for this period' });
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Get analytics summary
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Get recent analytics
    const recentAnalytics = await Analytics.find({
      user: userId,
      startDate: { $gte: thirtyDaysAgo }
    }).sort({ startDate: -1 });

    // Calculate trends
    const trends = {
      workoutTrend: calculateTrend(recentAnalytics, 'workoutStats.totalWorkouts'),
      caloriesTrend: calculateTrend(recentAnalytics, 'workoutStats.totalCaloriesBurned'),
      goalProgressTrend: calculateTrend(recentAnalytics, 'goalStats.averageProgress')
    };

    res.json({
      recentAnalytics,
      trends
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics summary', error: error.message });
  }
};

// Helper function to calculate trends
function calculateTrend(data, path) {
  if (data.length < 2) return 0;
  
  const values = data.map(d => {
    const parts = path.split('.');
    return parts.reduce((obj, part) => obj[part], d);
  });

  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  
  return ((lastValue - firstValue) / firstValue) * 100;
}

// Get admin analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    // Get total users and active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, activeUsers, totalWorkouts, totalGoals, recentActivity] = await Promise.all([
      // Total users
      User.countDocuments(),
      
      // Active users (logged in within last 30 days)
      User.countDocuments({ lastLogin: { $gte: thirtyDaysAgo } }),
      
      // Total workouts
      Workout.countDocuments(),
      
      // Total goals
      Goal.countDocuments(),
      
      // Recent activity (combine recent workouts and goals)
      Promise.all([
        Workout.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'username')
          .lean(),
        Goal.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'username')
          .lean()
      ]).then(([workouts, goals]) => {
        const activities = [
          ...workouts.map(w => ({
            type: 'workout',
            description: `${w.user.username} completed a ${w.type} workout`,
            timestamp: w.createdAt
          })),
          ...goals.map(g => ({
            type: 'goal',
            description: `${g.user.username} set a new ${g.type} goal`,
            timestamp: g.createdAt
          }))
        ];
        return activities
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5);
      })
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalWorkouts,
      totalGoals,
      recentActivity
    });
  } catch (error) {
    console.error('Error in getAdminAnalytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
}; 