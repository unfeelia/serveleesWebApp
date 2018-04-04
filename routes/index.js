module.exports = (io)=>
{
var express = require('express');
let path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) 
{
    res.render('index', { title: 'Poker Games Online'});
});
router.get('/about', (req, res)=>
{
	res.render('about', {title: 'About'});
});
router.get('/api', (req, res)=>
{
	res.render('api', {title: 'API'});
});
router.get('/pokergames', (req, res)=>
{
	res.render('pokergames', {title: 'Poker Games'});
});
router.get('/profile', (req, res)=>
{
	res.render('profile', {title: 'Profile'});
});
router.get('/contacts', (req, res)=>
{
	res.render('contacts', {title: 'Contacts'});
});
router.get('/howtoplay', (req, res)=>
{
	res.render('howtoplay', {title: 'How to play'});
});
router.get('/pokergame/:id', (req, res)=>
{
	io.on('connection', (socket)=>
	{
		console.log('connected to a game');
		// socket.on('up', data=>
		// {
			// //console.log('at least so' + data.id);
			// if(data.id)
			// {
				// //console.log('emited');
				// io.emit('update', data);
			// }
		// });
	})
	res.render('pokergame', {id: req.params.id});
});
return router;
}
