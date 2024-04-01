const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')

// GET request to fetch all users
router.get('/all', userController.getAllUsers)

// GET request to fetch a specific user by ID
router.get('/:id', userController.getUserById)

router.post(
  '/claimDaily',
  passport.authenticate('jwt', { session: false }),
  userController.claimDaily,
)

// Export the router
module.exports = router
