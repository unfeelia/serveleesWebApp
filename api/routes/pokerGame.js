var express = require('express');
var router = express.Router({mergeParams: true});
let ajv = require('../jsonSchemaValidator/jsonSchemaValidator');
let pokerGame = require('../../models/pokerGameModel').model;
let jsonwebtoken = require('jsonwebtoken');
let mongoose    = require('mongoose');
let user = require('../../models/userModel').model;
let deck = require('../../models/cardModel').deckModel;
let pokerGameId = require('./pokerGameId');
let Hand = require('pokersolver').Hand;

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
	{
		return firstPlayerInGameIndex;
	}
	else if(ct !== nextPlayerInGameIndex)
	{
		return nextPlayerInGameIndex;
	}
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
let switchWinnersIndices = (game)=>
{
	let playersInGame = game.players.filter((pl) => {return pl.inGame});
	let tableCards = [];
	
	tableCards.push(evaluateCard(game.tableCards.cardOne));
	tableCards.push(evaluateCard(game.tableCards.cardTwo));
	tableCards.push(evaluateCard(game.tableCards.cardThree));
	tableCards.push(evaluateCard(game.tableCards.cardFour));
	tableCards.push(evaluateCard(game.tableCards.cardFive));
	
	console.log('table cards: ' + tableCards);
	let hands = [];
	for(let i = 0; i < playersInGame.length; ++i)
	{
		let hand = Array.from(tableCards);
		hand.push(evaluateCard(playersInGame[i].cardOne));
		hand.push(evaluateCard(playersInGame[i].cardTwo));
		let temp = Hand.solve(hand);
		hands[i] = temp;
	}
	let winners = Hand.winners(hands);
	let result = [];
	winners.forEach((valueW, index)=>
	{
		console.log('winners"s hand: ' + valueW);
		let ind = hands.findIndex((value, i)=>
		{
			return value === valueW;
		});
		if(ind > -1)
		{
			result.push(playersInGame[index]._id);
		}
	});
	
	let atLeastResult = [];
	result.forEach((item, index, array)=>
	{
		atLeastResult.push(game.players.findIndex((elem) =>{return elem._id === item}));
	});
	
	console.log(atLeastResult);
	return [0];
}
let evaluateCard = (card)=>
{
	let result = '';
	switch (Number(card.value))
	{
		case 0:
			result = result + '2';
			break;
		case 1:
			result = result + '3';
			break;
		case 2:
			result = result + '4';
			break;
		case 3:
			result = result + '5';
			break;
		case 4:
			result = result + '6';
			break;
		case 5:
			result = result + '7';
			break;
		case 6:
			result = result + '8';
			break;
		case 7:
			result = result + '9';
			break;
		case 8:
			result = result + 'T';
			break;
		case 9:
			result = result + 'J';
			break;
		case 10:
			result = result + 'Q';
			break;
		case 11:
			result = result + 'K';
			break;
		case 12:
			result = result + 'A';
			break;
		default:
			throw new Error('incorrect card vale');
	}
	
	switch (card.mark)
	{
		case 0:
			result = result + 'd';
			break;
		case 1:
			result = result + 'c';
			break;
		case 2:
			result = result + 'h';
			break;
		case 3:
			result = result + 's';
			break;
		default:
			throw new Error('incorrect card vale');
	}
	return result;
}
let resetGame = (game)=>
{
	console.log('game in resetGame: ' + game);
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
				let winnersIndices = switchWinnersIndices(req.game);
				for(let i = 0; i < winnersIndices.length; ++i)
				{
					console.log('money of the first player: ' + req.game.players[winnersIndices[i]].money);
					console.log('bank: ' + req.game.bank);
					console.log('count of winners: ' + winnersIndices.length);
					req.game.players[winnersIndices[i]].money += req.game.bank / winnersIndices.length;
					
					console.log(req.game.players[winnersIndices[i]].money);
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

//create a game according to req.body and json schema. if success send data about created game
router.put('/', (req, res)=>
{
	//console.log('here');
	if(req.user)
	{
		let valid = ajv.validate("putPokerGame", req.body);
		if(valid)
		{
			let body = req.body;
			body.hostId = req.user.id;
			body.players = 
			[
			{
				player: body.hostId,
				money: body.baseStack
			}
			];
			let newDeck = new deck();
			body.deck = newDeck;
			//console.log(body);
			let pg = new pokerGame(req.body);
			pg.players[0].money = pg.baseStack;
			//console.log(pg);
			pg.save((err, game)=>
			{
				if(err)
				{
					return res.status(400).send({error: err});
				}
				else
				{
					return res.status(200).send(game);
				}
			}
			);
		}
		else
		{
			req.errors.ajvErrors = ajv.errors;
			return res.status(400).json(req.errors);
		}
	}
	else
	{
		return res.status(400).json(req.errors);
	}
});

//checking if there is requested game. if yes, req.game = object from db model, else req.errors.dbFindGameError = {error: "there is no such game"}
router.use('/:id', (req, res, next)=>
{
	mongoose.model('pokerGame').findOne({_id: req.params.id})
	.then(result=>
	{
		req.game = result;
		next();
	})
	.catch(err=> 
	{ 
		req.errors.dbFindGameError = {error: "there is no such game"};
		next();
	});
});
//cheking which rights have requester
router.use('/:id', (req, res, next)=>
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
			if(req.game.hostId.toString() === req.user.id.toString())
				req.iAmHost = true;
			else
				req.iAmHost = false;
			req.iAmPlayer = true;
			return index;
		})
		.then(index=>
		{
			let player = req.game.players[index];
			let inGame = player.inGame;
			let myTurn = req.game.whichPlayerTurn === index;
			req.myNumber = index;
			req.myTurn = inGame && myTurn;
			//console.log('it is ' + req.myTurn + ', req.myNumber: ' + req.myNumber + ', and right now is turn number: ' + req.game.whichPlayerTurn);
			next();
		})
		.catch(err=>
		{
			if(err)
			{
				req.iAmPlayer = false;
				next();
			}
		});
	}
	else
	{
		next();
	}
});

router.get('/:id', (req, res)=>
{
	let valid = ajv.validate("getPokerGame", req.body);
	if(valid)
	{	
		if(req.user && req.game && (!req.game.private || (req.game.private && req.iAmPlayer)))
		{
			let game = {};
			Object.assign(game, req.game.toObject());
			delete game.dateOfEnding;
			delete game._id;
			delete game.__v;
			//console.log(game.players);
			user.findOne({'_id': game.hostId})
			.then((result)=>
			{
				game.hosterName = result.name;
				//game.hosterId = game.hostId;
				game.hostId;
				delete game.deck;
				// console.log(game);
			})
			.then(()=>
			{
				let promises = []
				game.players.forEach((value, index, array)=>
				{
					//console.log('req.user.id' + req.user.id);
					//console.log('value.player' + value.player);
					if(req.user.id.toString() !== value.player.toString())
					{
						//console.log('i am here');
						delete value.cardOne;
						delete value.cardTwo;
					}
					else
					{
						game.myNumber = index;
					}
					promises.push(
					user.findOne({'_id': value.player})
					.then((result)=>
					{
						//console.log(result.name);
						value.name = result.name;
						delete value.player;
						// console.log(value);
					})
					.catch
					(err=>{
						req.errors.dbErrors = err;
						// return res.status(500);
					}));
				});
				Promise.all(promises)
				.then(values=>
				{
					return res.status(200).json(game);
				})
			})
			.catch(err=>
			{
				console.log(err + ": errrrrrrrors");
				req.errors.dbErrors = err;
				console.log('here 3');
				console.log(req.errors);
				return res.status(500).json(req.errors);
			});
		}
		else
		{
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
	let valid = ajv.validate("deletePokerGame", req.body);
	if(valid && req.game && req.user)
	{
		let hasAccess = req.iAmHost;
		if(hasAccess)
		{
			req.game.remove((err, obj)=>
			{
				if(err)
				{
					req.errors.dbRemoveError = err;
					return res.status(500).json(req.errors);
				}
				else
				{
					return res.status(200).json({message: "game with id: " + obj._id + ", was sucessfully deleted"});
				}
			});
		}
		else
		{
			req.errors.accessError = "you have no rights to delete this game";
			return res.status(500).json(req.errors);
		}
	}
	else
	{
		req.errors.ajvErrors = ajv.errors;
		return res.status(400).json(req.errors);
	}
});
router.post('/:id', (req, res)=>
{
	let valid = ajv.validate("postPokerGame", req.body);
	if(valid && req.game && req.user)
	{
		let hasAccess = req.iAmHost;
		if(hasAccess)
		{
			if(req.body.name !== undefined)
			{
				//console.log(req.body.name);
				req.game.name = req.body.name;
			}
			if(req.body.private !== undefined)
			{
				req.game.private = req.body.private;
			}
			if(req.body.ante !== undefined)
			{
				req.game.ante = req.body.ante;
			}
			if(req.body.baseStack !== undefined)
			{
				req.game.baseStack = req.body.baseStack;
			}
			if(req.body.minBet !== undefined)
			{
				req.game.minBet = req.body.minBet;
			}
			//console.log(req.game);
			saveGame(req.game, "game with id: " + req.game._id + ", was sucessfully updated", req, res);
		}
		else
		{
			req.errors.accessError = "you have no rights to update properties of this game";
			return res.status(500).json(req.errors);
		}
	}
	else
	{
		req.errors.ajvErrors = ajv.errors;
		return res.status(400).json(req.errors);
	}
});
router.post('/:id/join', (req, res)=>
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
			req.errors.accessErr = "that game is private, you have no access";
			return res.status(403).json(req.errors);
		}
	}
	else
	{
		return res.status(400).json(req.errors);
	}
});
router.post('/:id/leave', (req, res)=>
{
	if(req.user && req.game)
	{
		if(req.iAmPlayer)
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
				req.game.players.splice(index, 1);
				if(req.iAmHost)
				{
					req.game.remove((err, obj)=>
					{
						if(err)
						{
							req.errors.dbRemoveError = err;
							return res.status(500).json(req.errors);
						}
						else
						{
							return res.status(200).json({message: "host leaved the game, game was deleted, game id: " + obj._id});
						}
					});
				}
				else
				{
					//console.log('found');
					saveGame(req.game, 'player with id:' + req.user.id + ' successufuly leaved a game with id: ' + req.game._id, req, res);
				}
			})
			.catch(err=>
			{
				console.log('not found' + err);
				if(err)
				{
					req.errors.findAPlayerError = err;
					return res.status(400).json(req.errors);
				}
			});
		}
		else
		{
			req.errors.accessErr = "you cant leave this game, if you are not a player";
			return res.status(403).json(req.errors);
		}
	}
	else
	{
		return res.status(400).json();
	}
});
router.post('/:id/bet', (req, res)=>
{
	if(req.user && req.game && req.myTurn)
	{
		if(req.body.bet)
		{
			if(parseInt(req.body.bet) + parseInt(req.game.players[req.myNumber].bet) >= parseInt(req.game.maxBet) && parseInt(req.body.bet) + parseInt(req.game.players[req.myNumber].bet) >= parseInt(req.game.minBet))
			{
				if(parseInt(req.body.bet) < parseInt(req.game.players[req.myNumber].money))
				{
					req.game.players[req.myNumber].bet = parseInt(req.body.bet) + parseInt(req.game.players[req.myNumber].bet);
					req.game.bank = parseInt(req.game.bank) + parseInt(req.body.bet);
					req.game.players[req.myNumber].money = parseInt(req.game.players[req.myNumber].money) - parseInt(req.body.bet);
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
		req.errors.turnError = 'that is not your turn';
		return res.status(400).json(req.errors);
		//return res.status(200).send({error: 'that is not your turn'});
	}
});
router.post('/:id/fold', (req, res)=>
{
	//console.log(req.user);
	//console.log(req.game);
	//console.log(req.myTurn);
	if(req.user && req.game && req.myTurn)
	{
		//console.log('here');
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
			req.errors.turnError = 'you are the last player, you have to play to the end';
			return res.status(400).json(req.errors);
			//return res.status(200).send({error: 'you are the last player, you have to play to the end'});
		}
	}
	else
	{
		//c//onsole.log('or here');
		req.errors.turnError = 'that is not your turn';
		return res.status(400).json(req.errors);
	}
});
router.post('/:id/check', (req, res)=>
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
			return res.status(400).send({error: 'you cant check if your bet is not the bigest one'});
		}
	}
	else
	{
		return res.status(400).send({error: 'that is not your turn'});
	}
});
router.post('/:id/start', (req, res, next)=>
{
	let firstPlayerInGameIndex = req.game.players.findIndex((pl) => {return pl.inGame});
	if(req.game.finished || firstPlayerInGameIndex === -1)
	{
		console.log("req.game: " + req.game._id);
		req.game = resetGame(req.game);
		//req.game = resetGame(req.game);
		console.log('result of reseting ' + req.game);
		console.log('reeseted');
		saveGame(req.game, "game have started", req, res);
	}
	else
	{
		saveGame(req.game, "game is not finished", req, res);
	}
	return res.status(200);
});

module.exports = router;