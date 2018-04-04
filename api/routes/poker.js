'use strict'
var express = require('express');
let router = express.Router();
let pokerGame = require('./pokerGame');
let pokerGameId = require('./pokerGameId');
let pokerGames = require('./pokerGames');

router.use('/pokergame', pokerGame);
router.use('/pokergames', pokerGames);

module.exports = router;