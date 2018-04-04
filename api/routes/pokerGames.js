var express = require('express');
var router = express.Router({mergeParams: true});
let ajv = require('../jsonSchemaValidator/jsonSchemaValidator');
let pokerGame = require('../../models/pokerGameModel').model;
let jsonwebtoken = require('jsonwebtoken');
let mongoose    = require('mongoose');
let user = require('../../models/userModel').model;
let deck = require('../../models/cardModel').deckModel;

let gameDataHandlerFromServerToClient = (Game)=>
{
	return new Promise((resolve, reject)=>
	{
			let game = {};
			Object.assign(game, Game.toObject());
			delete game.dateOfEnding;
			delete game._id;
			delete game.__v;
			
			let promise1 = new Promise((resolve, reject)=>
			{
				let promises = [];
				game.players.forEach((value, index, array)=>
				{
					delete value.cardOne;
					delete value.cardTwo;
					promises.push(user.findOne({'_id': value.player}));
				});
				Promise.all(promises)
				.then(values=>
				{
					for(let i = 0; i < values.length; ++i)
					{
						game.players[i].name = values[i].name;
					}
					resolve(game);
				})
				.catch(err=>
				{
					reject(err);
					//req.errors.dbErrors = err;
					// return res.status(500);
				});
			});

			promise1
			.then(game=>
			{
				user
				.findOne({'_id': game.hostId})
				.then((result)=>
				{
					game.hosterName = result.name;
					delete game.deck;
					return resolve(game);
				}).
				catch(err=>
				{
					return reject(err);
				});
			})
			.catch(err=>
			{
				reject(err);
			});
	});
}


//checking if user authorised. if yes, req.user = data, else res.errors.authorisedError
router.use('/', (req, res, next)=>
{
	req.errors = {};
	req.user = null;
	if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')
	{
		jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'restfullapi', (err, decode)=>
		{
			if(err) 
			{
				req.errors.authorisedError = "you are not authorized";
				next();
			}
			else
			{
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
router.get('/', (req, res)=>
{
	//console.log('pokergames');
	mongoose.model('pokerGame').find({private: false})
	.then(result=>
	{
		//let data = [];
		let promises = [];
		for(let i = 0; i < result.length; ++i)
		{
			promises.push(gameDataHandlerFromServerToClient(result[i]));
			//console.log(promises);
		}
		return promises;
		//console.log(promises);
		// Promise.all(promises)
		// .then(values=>
		// {
			// // console.log(values);
			// return res.status(200).json(data);
		// })
		// .catch(err=>
		// {
			// // console.log('3');
			// req.errors.dataHandlerError = err;
			// return res.status(500).json(req.errors);
		// });
	})
	.then(promises=>
	{
		return Promise.all(promises);
	})
	.then(values=>
	{
		console.log(values);
		return res.status(200).json(values);
	})
	.catch(err=>
	{
		req.errors.dataHandlerError = err;
		return res.status(500).json(req.errors);
	});//исправить обработчик ошибки и жизнь
});

module.exports = router;