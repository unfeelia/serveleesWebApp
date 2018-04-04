var express = require('express');
var router = express.Router();

router.get('/signin', function(req, res, next) 
{
	//console.log('request to load signin page');
	res.render('signin');
});
router.get('/signup', function(req, res, next) 
{
	res.render('signup');
});

module.exports = router;