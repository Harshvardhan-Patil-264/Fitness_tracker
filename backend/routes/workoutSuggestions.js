const express = require('express');
const router = express.Router();
const workoutSuggestionController = require('../controllers/workoutSuggestionController');
const { protect, admin } = require('../middleware/auth');

// Get all workout suggestions (admin only)
router.get('/all', [protect, admin], workoutSuggestionController.getAllWorkoutSuggestions);

// Get active workout suggestions
router.get('/active', protect, workoutSuggestionController.getActiveWorkoutSuggestions);

// Get single workout suggestion
router.get('/:id', protect, workoutSuggestionController.getWorkoutSuggestion);

// Create workout suggestion (admin only)
router.post('/', [protect, admin], workoutSuggestionController.createWorkoutSuggestion);

// Update workout suggestion (admin only)
router.put('/:id', [protect, admin], workoutSuggestionController.updateWorkoutSuggestion);

// Delete workout suggestion (admin only)
router.delete('/:id', [protect, admin], workoutSuggestionController.deleteWorkoutSuggestion);

module.exports = router; 