const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const workoutController = require('../controllers/workoutController');

// All routes are protected
router.use(protect);

// Workout routes
router.post('/', workoutController.createWorkout);
router.get('/', workoutController.getWorkouts);
router.get('/stats', workoutController.getWorkoutStats);
router.get('/:id', workoutController.getWorkoutById);
router.put('/:id', workoutController.updateWorkout);
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router; 