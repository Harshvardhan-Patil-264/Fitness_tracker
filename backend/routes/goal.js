const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const goalController = require('../controllers/goalController');

// All routes are protected
router.use(protect);

// Goal routes
router.post('/', goalController.createGoal);
router.get('/', goalController.getGoals);
router.get('/stats', goalController.getGoalStats);
router.get('/:id', goalController.getGoalById);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);
router.patch('/:id/progress', goalController.updateProgress);

module.exports = router; 