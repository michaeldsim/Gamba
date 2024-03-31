const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1w'
    });
};

// Controller for registering a new user
exports.registerUser = async (req, res) => {
    try {
        const { username } = req.body;

        // Find the user by username
        const usernameExists = await User.findOne({ username }).exec();

        if (usernameExists) {
            return res.status(409).json({ message: 'User with that name already exists' });
        }

        const user = new User(req.body);
        await user.save(); // Save the user to the database

        // Generate JWT
        const token = generateToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'Strict', // can be 'Strict', 'Lax', or 'None'
            maxAge: 604800000, // cookie expiry set to match JWT expiry, here it's 1 hour
        }).status(200).json({
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Controller for fetching all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Find all users in the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Controller for fetching a specific user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Controller for user login
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username }).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the entered password matches the hashed password
        const isMatch = await user.isPasswordMatch(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate JWT
        const token = generateToken(user);

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'Strict', // can be 'Strict', 'Lax', or 'None'
            maxAge: 604800000, // cookie expiry set to match JWT expiry, here it's 1 hour
        }).status(200).json({
            username: user.username,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};