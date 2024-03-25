const User = require('../models/User');

// Controller for registering a new user
exports.registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const newUser = new User(req.body); // Assuming User is a Mongoose model
        await newUser.save(); // Save the user to the database
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Controller for fetching all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Find all users in the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Controller for fetching a specific user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};
