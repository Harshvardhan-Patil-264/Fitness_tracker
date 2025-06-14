const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all users (admin only)
router.get('/', [auth, admin], userController.getAllUsers);

// Get a single user
router.get('/:id', auth, userController.getUser);

// Create a new user (admin only)
router.post('/', [auth, admin], userController.createUser);

// Update a user
router.put('/:id', auth, userController.updateUser);

// Delete a user (admin only)
router.delete('/:id', [auth, admin], userController.deleteUser);

module.exports = router; 