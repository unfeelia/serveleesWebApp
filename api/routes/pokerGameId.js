var express = require('express');
var router = express.Router({mergeParams: true});
let ajv = require('../jsonSchemaValidator/jsonSchemaValidator');
let pokerGame = require('../../models/pokerGameModel').model;
let deck = require('../../models/cardModel').deckModel;
let jsonwebtoken = require('jsonwebtoken');
let mongoose    = require('mongoose');
let randomNumber = require("random-number-csprng");
let user = require('../../models/userModel').model;

let switchPlayerWhichPlay = (req, res)=>
{
	let ct = req.game.whichPlayerTurn;
	let lastPlayerInGameIndex = 0;
	let firstPlayerInGameIndex = -1;
	let nextPlayerInGameIndex = -1;
	for(let i = 0; i < req.game.players.length; ++i)
		{
			if(req.game.players[i].inGame)
			{
			    lastPlayerInGameIndex = i;
			    if(firstPlayerInGameIndex === -1)
					firstPlayerInGameIndex = i;
				if(nextPlayerInGameIndex <= ct)
					nextPlayerInGameIndex = i;
			}
		}
	if(ct === lastPlayerInGameIndex)
		return firstPlayerInGameIndex;
	else if(ct !== nextPlayerInGameIndex)
		return nextPlayerInGameIndex;
}
let saveGame = (game, successMessage, req, res)=>
{
	game.save((err, result)=>
	{
		if(err)
		{
			res.status(400).json({message: err.message});
		}
		else
		{
			res.status(200).json({message: successMessage, game: result});
		}
	});
}
let switchWinnersIndices = (players)=>
{
	return [0];
}
let resetGame = (game)=>
{
	game.bank = 0;
	let newDeck = new deck();
	game.deck = newDeck;
	//console.log(game.deck.cards);
	game.tableCards.cardOne = game.deck.cards[game.deck.cards.length - 1];
	game.deck.cards.pop();
	game.tableCards.cardTwo = game.deck.cards[game.deck.cards.length - 1];
	game.deck.cards.pop();
	game.tableCards.cardThree = game.deck.cards[game.deck.cards.length - 1];
	game.deck.cards.pop();
	game.tableCards.cardFour = null;
	game.tableCards.cardFive = null;
	game.whichPlayerTurn = 0;
	game.maxBet = 0;
	game.finished = false;
	for(let j = 0; j < game.players.length; ++j)
	{
		if(game.players[j].money > game.ante)
		{
			game.players[j].money -= game.ante;
			game.players[j].inGame = true;
			game.players[j].bet = 0;
			game.players[j].cardOne = game.deck.cards[game.deck.cards.length - 1];
			game.deck.cards.pop();
			game.players[j].cardTwo = game.deck.cards[game.deck.cards.length - 1];
			game.deck.cards.pop();
		}
		else
		{
			game.players.splice(j, 1);
		}
	}
	game.bank = game.ante * game.players.length;
	return game;
}
let goNext = (req, res)=>
{
	let firstPlayerInGameIndex = req.game.players.findIndex((pl) => {return pl.inGame});
	let playersInGame = req.game.players.filter((pl) => {return pl.inGame});
	if(req.game.whichPlayerTurn === firstPlayerInGameIndex)
	{
		let isItTime = true;
		for(let i = 0; i < playersInGame.length; ++i)
		{
			if(playersInGame[i].bet !== req.game.maxBet)
			{
				isItTime = false;
				break;
			}
		}
		if(isItTime)
		{
			//console.log('was made a step');
			if(req.game.tableCards.cardOne === null)
			{
				req.game.tableCards.cardOne = req.game.deck.cards[req.game.deck.cards.length - 1];
				//console.log(req.game.deck);
				req.game.deck.cards.pop();
				return 'first card have drawn';
				//saveGame(req.game, "first card have drawn", req, res);
			}
			else if(req.game.tableCards.cardTwo === null)
			{
				req.game.tableCards.cardTwo = req.game.deck.cards[req.game.deck.cards.length - 1];
				req.game.deck.cards.pop();
				return 'second card have drawn';
				//saveGame(req.game, "second card have drawn", req, res);
			}
			else if(req.game.tableCards.cardThree === null)
			{
				req.game.tableCards.cardThree = req.game.deck.cards[req.game.deck.cards.length - 1];
				req.game.deck.cards.pop();
				return 'third card have drawn';
				//saveGame(req.game, "third card have drawn", req, res);
			}
			else if(req.game.tableCards.cardFour === null)
			{
				req.game.tableCards.cardFour = req.game.deck.cards[req.game.deck.cards.length - 1];
				req.game.deck.cards.pop();
				return 'fourth card have drawn';
				//saveGame(req.game, "fourth card have drawn", req, res);
			}
			else if(req.game.tableCards.cardFive === null)
			{
				req.game.tableCards.cardFive = req.game.deck.cards[req.game.deck.cards.length - 1];
				req.game.deck.cards.pop();
				return 'fivth card have drawn';
				//saveGame(req.game, "fivth card have drawn", req, res);
			}
			else
			{
				let winnersIndices = switchWinnersIndices();
				for(let i = 0; i < winnersIndices.length; ++i)
				{
					req.game.players[winnersIndices[i]].money += req.game.bank / winnersIndices.length;
				}
				for(let i = 0; i < req.game.players.length; ++i)
				{
					req.game.players[i].inGame = false;
					req.game.players[i].bet = 0;
				}
				req.game.dateOfEnding = Date.now();
				req.game.whichPlayerTurn = 0;
				req.game.maxBet = 0;
				req.game.bank = 0;
				req.game.finished = true;
				//req.game = resetGame(req.game);
				return 'game have finished';
				//saveGame(req.game, "game have finished", req, res);
			}
		}
		else
		{
			return  "bets are not equal, barter must continue";
		}
	}
	else 
	{
		//saveGame(req.game, "it is not time", req, res);
		return "there are still players on this turn to move";
	}
}

router.use((req, res, next)=>
{
	req.errors = [];
	next();
});
//checking if user authorised. if yes, req.user = data, else respond(error)
router.use('/', (req, res, next)=>
{
	if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')
	{
		jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'restfullapi', (err, decode)=>
		{
			if(err) 
			{
				//res.status(401).send({error: 'you are not authorized'});
				req.errors.push({error: 'you are not authorized'});
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
		//return res.status(400).send({error: 'havenot provide data to authorization'});
		req.errors.push({error: 'havenot provide data to authorization'});
		next();
	}
});

//checking if there is requested game. if yes, req.game = object from db model, else respond(error)
router.use('/', (req, res, next)=>
{
	mongoose.model('pokerGame').findOne({_id: req.params.id})
	.then(result=>
	{
		//let player = game.players.find(player => player.player.toString() === req.decode)
		req.game = result;
		next();
	})
	.catch(err=> 
	{ 
		//return res.status(400).send({error: "there is no such game"});
		req.errors.push({error: "there is no such game"});
		//console.log(req);
		//console.log(req.errors);
		next();
	});
	//console.log(req.errors);
});

//joining to existing game
router.post('/join', (req, res)=>
{
	if(req.user && req.game)
	{
	if(!req.game.private)
	{
	let player = 
	{
		player: req.user.id,
		money: req.game.baseStack
	};
	req.game.players.push(player);
	saveGame(req.game, 'player with id:' + player.player + ' successufuly added to game with id: ' + req.game._id, req, res);
	}
	else
	{
		return res.status(403).send({message: "that game is private"});
	}
	}
	else
	{
		return res.status(400).send();
	}
});
//m-w to check if requester is in game or game is not private
//if yes => req.hasAccess = true
router.use((req, res, next)=>
{
	//console.log(req.game);
	if(req.user && req.game)
	{
	if(req.game.private)
	{
	let promise = new Promise((resolve, reject)=>
	{
		let index = req.game.players.findIndex(player => 
		{ 
			return (player.player.toString() === req.user.id);
		});
		if(index > -1)
		{
			resolve(index);
		}
		else
		{
			reject(new Error('there is no such player in the game'));
		}
	});
	promise
	.then(index=>
	{
		req.hasAccess = true;
		next();
	})
	.catch(err=>
	{
		if(err)
		{
			req.hasAccess = false;
			//return res.status(400).send("you has no access to that private game");
			req.errors.push({error: "you has no access to that private game"});
			next();
		}
	});
	}
	else
	{
		req.hasAccess = true;
		next();
	}
	}
	//console.log(req.errors);
});
//getting information about a game(if it is not private, or requirer is in game)
router.get('/', (req, res)=>
{
	//console.log(req.errors);
	if(req.user && req.game)
	{
	let game = {};
	Object.assign(game, req.game.toObject());
	let errors = [];
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
			//console.log(result.name);
			value.name = result.name;
			delete value.player;
			//console.log(value);
		})
		.then(()=>
		{
			user.findOne({'_id': game.hostId})
			.then((result)=>
			{
				game.hosterName = result.name;
				delete game.hostId;
				delete game.deck;
				if(errors.length != 0)
				{
					return res.status(500);
				}
				else
				{
					return res.status(200).json(game);
				}
			}).
			catch(err=>
			{
				errors.push(err);
				return res.status(500);
			});
		})
		.catch(err=>
		{
			errors.push(err);
			return res.status(500);
		});
	});
	}
	else
	{
		//console.log(req.errors);
		res.status(400).send(Object.assign({}, req.errors));
	}
	//console.log(game.players);
	
});
//m-w to check if requester is in game and if it is his turn to move. 
//if yes => req.myTurn = true, req.myNumber = position, else = false,
//send error if there is no such player in game
router.use((req, res, next)=>
{
	if(req.user && req.game)
	{
	let promise = new Promise((resolve, reject)=>
	{
		let index = req.game.players.findIndex(player => 
		{ 
			return (player.player.toString() === req.user.id);
		});
		if(index > -1)
		{
			resolve(index);
		}
		else
		{
			reject(new Error('there is no such player in the game'));
		}
	});
	
	promise
	.then(index=>
	{
		let player = req.game.players[index];
		let inGame = player.inGame;
		let myTurn = req.game.whichPlayerTurn === index;
		req.myNumber = index;
		req.myTurn = inGame && myTurn;
		console.log('it is ' + req.myTurn + ', req.myNumber: ' + req.myNumber + ', and right now is turn number: ' + req.game.whichPlayerTurn);
		next();
	})
	.catch(err=>
	{
		if(err)
		{
			req.errors.push(err);
			next();
		}
		next();
	});
	}
	else
	{
		next();
	}
});
//making a bet. 
router.post('/bet', (req, res)=>
{
	if(req.user && req.game && req.myTurn)
	{
		if(req.body.bet)
		{
			if(req.body.bet + req.game.players[req.myNumber].bet >= req.game.maxBet && req.body.bet + req.game.players[req.myNumber].bet >= req.game.minBet)
			{
				if(req.body.bet < req.game.players[req.myNumber].money)
				{
					req.game.players[req.myNumber].bet += req.body.bet;
					req.game.bank += req.body.bet;
					req.game.players[req.myNumber].money -= req.body.bet;
					req.game.maxBet = req.game.players[req.myNumber].bet;
					//console.log(req.game.maxBet);
					req.game.whichPlayerTurn = switchPlayerWhichPlay(req, res);
					let gameControllerMessage = goNext(req, res);
					console.log(gameControllerMessage);
					return saveGame(req.game, "you successufuly added a bet with size: " + req.body.bet + "; " + gameControllerMessage, req, res);
				}
				else
				{
					return res.status(401).send({error: 'you have not enough money to make this bet. Your bet: ' + req.body.bet + ", but you have only: " + req.game.players[req.myNumber].money});
				}
			}
			else
			{
				return res.status(401).send({error: 'your bet is too small. it must be at least ' + (req.game.maxBet > req.game.minBet ? req.game.maxBet:req.game.minBet)});
			}
		}
		else
		{
			return res.status(401).send({error: 'there is no "bet" field in request'});
		}
	}
	else
	{
		return res.status(200).send({error: 'that is not your turn'});
	}
});
router.post('/fold', (req, res)=>
{
	if(req.user && req.game && req.myTurn)
	{
		let playersInGame = req.game.players.filter((pl) => {return pl.inGame});
		if(playersInGame.length > 1)
		{
			req.game.players[req.myNumber].inGame = false;
			req.game.bank += req.game.players[req.myNumber].bet;
			req.game.players[req.myNumber].bet = null;
			req.game.whichPlayerTurn = switchPlayerWhichPlay(req, res);
			let gameControllerMessage = goNext(req, res);
			saveGame(req.game, "you have folded, " + gameControllerMessage, req, res);
		}
		else
		{
			return res.status(200).send({error: 'you are the last player, you have to play to the end'});
		}
	}
	else
	{
		return res.status(200).send({error: 'that is not your turn'});
	}
});
router.post('/check', (req, res)=>
{
	if(req.user && req.game && req.myTurn)
	{
		if(req.game.maxBet === null || req.game.maxBet === 0 || req.game.players[req.game.whichPlayerTurn].bet === req.game.maxBet)
		{
			//req.game.maxBet = 0;
			req.game.whichPlayerTurn = switchPlayerWhichPlay(req, res);
			let gameControllerMessage = goNext(req, res);
			saveGame(req.game, "you have checked, " + gameControllerMessage, req, res);
		}
		else
		{
			return res.status(200).send({error: 'you cant check if your bet is not the bigest one'});
		}
	}
	else
	{
		return res.status(200).send({error: 'that is not your turn'});
	}
});
//m-w to check conditions to go to the next gamestep. if its true, she does it
router.post('/start', (req, res, next)=>
{
	//return res.status(200).send();
	let firstPlayerInGameIndex = req.game.players.findIndex((pl) => {return pl.inGame});
	//let playersInGame = req.game.players.filter((pl) => {return pl.inGame});
	//console.log(req.game.whichPlayerTurn + '/start' + firstPlayerInGameIndex);
	if(req.game.finished || firstPlayerInGameIndex === -1)
	{
		req.game = resetGame(req.game);
		saveGame(req.game, "game have started", req, res);
	}
	else
	{
		saveGame(req.game, "game is not finished", req, res);
	}
});


module.exports = router;