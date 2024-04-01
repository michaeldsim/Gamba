const Game = require('../models/Game')

// List all games
exports.listGames = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10 // Default to 10 items per page

  if (limit > 50) {
    res
      .status(400)
      .json({ message: 'Requested limit is too high. Maximum is 50 ' })
  }

  const skip = (page - 1) * limit

  try {
    const games = await Game.find().skip(skip).limit(limit)
    const totalCount = await Game.countDocuments()

    res.status(200).json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: games,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

// List games by a specific user
exports.listGamesByUser = async (req, res) => {
  const { userId } = req.params
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10 // Default to 10 items per page
  const skip = (page - 1) * limit

  try {
    const games = await Game.find({ user_id: userId })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
    const totalCount = await Game.countDocuments({ user_id: userId })

    res.status(200).json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      data: games,
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
