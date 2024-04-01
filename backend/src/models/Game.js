const mongoose = require('mongoose')
const User = require('./User')
const logger = require('../utils/logger')

// Define the user schema
const gameSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  wagered: {
    type: Number,
    required: [true, 'Wager amount is required'],
  },
  game: {
    type: Number, // 0 is High Low
  },
  result: {
    type: Number, // 0 is loss, 1 is win
  },
  earnings: {
    type: Number,
  },
})

gameSchema.pre('save', async function (next) {
  const user = await User.findById(this.user_id).select('wagered level balance')

  user.balance += parseFloat(this.earnings)
  user.wagered += parseFloat(this.wagered)

  const suggestedLevel = Math.floor(user.wagered / 100)
  if (user.level !== suggestedLevel) {
    user.level = suggestedLevel
  }

  await user.save()
  logger.info(`Game (${this._id}) created for user ${user._id}`)
  next()
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
