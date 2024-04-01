const express = require('express')
const router = express.Router()
const passport = require('passport')
const Game = require('../../models/Game')

// Function to calculate profit multiplier
function calculateProfitMultiplier(winChance) {
  return 100 / winChance - 1
}

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = req.user
    const { guess, chosenNumber, wager } = req.body

    // Simulate number generation and calculate win/loss
    const resultNumber = Math.floor(Math.random() * 101)
    const winChance = guess === 'higher' ? 100 - chosenNumber : chosenNumber
    const isWin =
      (guess === 'higher' && resultNumber > chosenNumber) ||
      (guess === 'lower' && resultNumber < chosenNumber)
    const profitMultiplier = calculateProfitMultiplier(winChance)
    const earnings = isWin ? wager * profitMultiplier : -wager

    const game = new Game({
      user_id: user._id,
      wagered: wager,
      game: 0,
      result: isWin ? 1 : 0,
      earnings,
    })

    await game.save()

    res.status(200).json({
      message: isWin ? 'You won!' : 'You lost!',
      resultNumber,
      updatedBalance: user.balance,
    })
  },
)

module.exports = router
