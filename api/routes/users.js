var express = require('express');
var router = express.Router({mergeParams: true});
let ajv = require('../jsonSchemaValidator/jsonSchemaValidator');
let pokerGame = require('../../models/pokerGameModel').model;
let jwt = require('jsonwebtoken');
let mongoose    = require('mongoose');
let user = require('../../models/userModel').model;
let deck = require('../../models/cardModel').deckModel;
let pokerGameId = require('./pokerGameId');
let	bcrypt = require('bcryptjs');

let gameDataHandlerFromServerToClient = (Game)=>
{
			let game = {};
			Object.assign(game, Game.toObject());
			delete game.dateOfEnding;
			delete game._id;
			delete game.__v;
			//console.log(game.players);
			game.players.forEach((value, index, array)=>
			{
				delete value.cardOne;
				delete value.cardTwo;
				user.findOne({'_id': value.player}).
				then((result)=>
				{
					// console.log(result.name);
					value.name = result.name;
					delete value.player;
					// console.log(value);
				})
				.catch(err=>
				{
					console.log(err);
					//req.errors.dbErrors = err;
					// return res.status(500);
				});
			});
			user.findOne({'_id': game.hostId})
			.then((result)=>
			{
				game.hosterName = result.name;
				delete game.hostId;
				delete game.deck;
				// console.log(game);
				return game;
				//return res.status(200).json(game);
			}).
			catch(err=>
			{
				console.log(err + ": errrrrrrrors");
				req.errors.dbErrors = err;
				console.log('here 3');
				console.log(req.errors);
				return null;
				//return res.status(500).json(req.errors);
			});
}

//checking if user authorised. if yes, req.user = data, else res.errors.authorisedError
router.use('/', (req, res, next)=>
{
	req.errors = {};
	if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')
	{
		jwt.verify(req.headers.authorization.split(' ')[1], 'restfullapi', (err, decode)=>
		{
			if(err) 
			{
				req.errors.authorisedError = "you are not authorized";
				next();
			}
			else
			{
				console.log(" decode:");
				console.log(decode);
				req.user = decode;
				next();
			}
		});
	}
	else
	{
		req.errors.authorisedError = "have not provide data to authorization";
		next();
	}
});

router.get('/:id', (req, res)=>
{
	console.log(req.user);
	let valid = ajv.validate("getUser", req.body);
	console.log(req.body);
	console.log(" here body opisano");
	if(valid)
	{	
		if(req.user && req.user.id === req.params.id)
		{
			let userInfo = {};
			user.findOne({'_id': req.params.id})
			.then((result)=>
			{
				result = result.toObject();
				//console.log(result);
				delete result.__v;
				delete result.hashPassword;
				//console.log('here');
				return res.status(200).json(result);
			})
			.catch(err=>
			{
				req.errors.dbErrors = err;
				return res.status(500).json(req.errors);
			});
		}
		else
		{	
			console.log(req.user.id);
			let err = {message: 'You have no rights to see this profile.'};
			req.errors.privErr = err;
			return res.status(400).json(req.errors);
		}
	}
	else
	{
		req.errors.ajvErrors = ajv.errors;
		return res.status(400).json(req.errors);
	}
});
router.delete('/:id', (req, res)=>
{
	let valid = ajv.validate("deleteUser", req.body);
	if(valid && req.user && req.user.id === req.params.id)
	{
		user.findOne({'_id': req.params.id})
			.then((result)=>
			{
				result.remove((err, result)=>
				{
					if(err)
					{
						return res.status(500).json(err);
					}
					else
					{
						return res.status(200).json({message: 'User with name:' + req.user.name + ", was sucessefully deleted."});
					}
				});
			})
			.catch(err=>
			{
				req.errors.dbErrors = err;
				return res.status(500).json(req.errors);
			});
	}
	else
	{
		req.errors.ajvErrors = ajv.errors;
		return res.status(400).json(req.errors);
	}
});
router.post('/:id', (req, res)=>
{
	let valid = ajv.validate("postUser", req.body);
	console.log(req.user);
	if(valid && req.user && req.user.id === req.params.id)
	{
		user.findOne({'_id': req.params.id})
			.then((result)=>
			{
				if(req.body.name)
				{
					//console.log('but here too');
					result.name = req.body.name;
				}
				if(req.body.email)
				{
						//console.log('but here too');
					result.email = req.body.email;
				}
				if(req.body.newPassword && req.body.oldPassword && result.comparePassword(req.body.oldPassword))
				{
					result.hashPassword = bcrypt.hashSync(req.body.newPassword, 10);
				}
				else
				{
					if(req.body.newPassword && req.body.oldPassword && !result.comparePassword(req.body.oldPassword))
					{
						//console.log('here');
						return res.status(400).json({errorMessage: 'incorrect password'});
					}
				}
				result.save((err, result)=>
				{
					if(err)
					{
						return res.status(500).json(err);
					}
					else
					{
						result = result.toObject();
						//console.log('result.id:');
						console.log(result);
						result.token = jwt.sign({name: result.name, id: result._id}, 'restfullapi'),
						delete result.__v;
						delete result.hashPassword;
						console.log(result);
						return res.status(200).json(result);
					}
				})
			})
			.catch(err=>
			{
				//console.log('here');
				req.errors.dbErrors = err;
				return res.status(500).json(req.errors);
			});
	}
	else
	{
		req.errors.ajvErrors = ajv.errors;
		return res.status(400).json(req.errors);
	}
});

router.put('/:id', (req, res)=>
{
	let valid = ajv.validate("putUser", req.body);
	if(valid && req.user && req.user.id === req.params.id)
	{
		let newUser = new user(req.body);
	
			newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
			newUser.save((err, User)=>
			{
				if(err)
				{
					return res.status(400).send({error: err});
				}
				else
				{
					User.hashPassword = undefined;
					return res.json(User);
				}
			}
			);
	}
	else
	{
		req.errors.ajvErrors = ajv.errors;
		return res.status(400).json(req.errors);
	}
});

module.exports = router;