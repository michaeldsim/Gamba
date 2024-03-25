const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST request to register a new user
router.post('/register', userController.registerUser);

// GET request to fetch all users
router.get('/', userController.getAllUsers);

// GET request to fetch a specific user by ID
router.get('/:id', userController.getUserById);

// Export the router
module.exports = router;