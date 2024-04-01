const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

const generateToken = user => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '1w',
    },
  )
}

// Controller for fetching all users
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  if (limit > 50) {
    return res.status(400).json({ message: 'Request limit cannot be over 50' })
  }
  const skip = (page - 1) * limit

  try {
    const users = await User.find().select('-password').skip(skip).limit(limit)

    const totalCount = await User.countDocuments()

    res.status(200).json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: users,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching users', error: error.message })
  }
}

// Controller for fetching a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password') // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user', error: error.message })
  }
}

// Controller for user login
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find the user by username
    const user = await User.findOne({ username }).select('-password').exec()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the entered password matches the hashed password
    const isMatch = await user.isPasswordMatch(password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    // Generate JWT
    const token = generateToken(user)

    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'Strict', // can be 'Strict', 'Lax', or 'None'
        maxAge: 604800000, // cookie expiry set to match JWT expiry, here it's 1 hour
      })
      .status(200)
      .json({
        username: user.username,
        balance: user.balance,
        level: user.level,
      })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}

exports.claimDaily = async (req, res) => {
  const user = req.user
  if (
    new Date($user.daily_last_claimed).getTime() - new Date().getTime() <
    24 * 60 * 60 * 1000
  ) {
    res
      .status(409)
      .json({ message: 'It has not been 24 hours since last claim.' })
  }
  const dailyAmount = 50 * (2 * user.level)
  user.balance += dailyAmount
  user.daily_last_claimed = new Date()
  await user.save()
  res.status(200).json({ updatedBalance: user.balance })
}
