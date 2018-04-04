var express = require('express');
var router = express.Router({mergeParams: true});
let userHandlers = require('../../api/controllers/userController');

router.put('/signup', function(req, res, next) 
{
	userHandlers.register(req, res);
});

router.post('/signin', function(req, res, next) 
{
	//console.log("trying to signin");
	userHandlers.signIn(req, res);
});

router.get('/amiauthorised', (req, res)=>
{
	if(req.user !== undefined)
	{
		return res.send({authorised: true});
	}
	else
	{
		return res.send({authorised: false});
	}
});

module.exports = router;