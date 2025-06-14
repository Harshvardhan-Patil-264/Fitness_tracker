const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// All routes are protected
router.use(protect);

// Analytics routes
router.post('/generate', analyticsController.generateAnalytics);
router.get('/', analyticsController.getAnalytics);
router.get('/summary', analyticsController.getAnalyticsSummary);

// Get admin analytics
router.get('/admin', [protect, admin], analyticsController.getAdminAnalytics);

module.exports = router; 