const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

const generateToken = user => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    },
  )
}

router.post('/register', async (req, res) => {
  try {
    const { username } = req.body

    // Find the user by username
    const usernameExists = await User.findOne({ username }).exec()

    if (usernameExists) {
      return res
        .status(409)
        .json({ message: 'User with that name already exists' })
    }

    const user = new User(req.body)
    await user.save() // Save the user to the database

    const token = generateToken(user._id)

    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'Strict', // can be 'Strict', 'Lax', or 'None'
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })
      .status(200)
      .json({
        username: user.username,
        balance: user.balance,
        level: user.level,
      })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error Registering user', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Find the user by username
    const user = await User.findOne({ username }).exec()
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
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
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
})

router.post('/logout', (req, res) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict' })
  res.status(200).send('Logged out successfully')
})

router.get('/verifySession', (req, res) => {
  let token = req.headers.cookie
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' })
  }

  if (token.startsWith('jwt=')) {
    token = token.slice(4, token.length)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: err.message })
    }

    const user = {
      id: decoded.id,
      username: decoded.username,
    }

    return res.status(200).json(user)
  })
})

module.exports = router
