const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(protect);
router.use(admin);

// User Management Routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// System Analytics Routes
router.get('/analytics', adminController.getSystemAnalytics);

// Health Tips Management Routes
router.post('/health-tips', adminController.createHealthTip);
router.get('/health-tips', adminController.getAllHealthTips);
router.put('/health-tips/:id', adminController.updateHealthTip);
router.delete('/health-tips/:id', adminController.deleteHealthTip);

module.exports = router; 