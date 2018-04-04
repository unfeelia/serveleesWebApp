'use strict'
let auth = require('../api/routes/auth');
var express = require('express');
let router = express.Router();
let poker = require('../api/routes/poker');
let users = require('../api/routes/users');

router.use('/auth', auth);
router.use('/poker', poker);
router.use('/users', users);

module.exports = router;