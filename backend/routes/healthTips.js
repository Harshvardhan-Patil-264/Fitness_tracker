const express = require('express');
const router = express.Router();
const healthTipController = require('../controllers/healthTipController');
const { protect, admin } = require('../middleware/auth');

// Get all health tips (admin only)
router.get('/all', [protect, admin], healthTipController.getAllHealthTips);

// Get active health tips
router.get('/active', protect, healthTipController.getActiveHealthTips);

// Get single health tip
router.get('/:id', protect, healthTipController.getHealthTip);

// Create health tip (admin only)
router.post('/', [protect, admin], healthTipController.createHealthTip);

// Update health tip (admin only)
router.put('/:id', [protect, admin], healthTipController.updateHealthTip);

// Delete health tip (admin only)
router.delete('/:id', [protect, admin], healthTipController.deleteHealthTip);

module.exports = router; 