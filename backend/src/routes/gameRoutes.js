const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const highLowRouter = require("./games/highLowRoutes")

// util routes
router.get('', gameController.listGames);
router.get('/:userId', gameController.listGamesByUser);

// game routes
// high low
router.use('/highlow', highLowRouter);

module.exports = router;
