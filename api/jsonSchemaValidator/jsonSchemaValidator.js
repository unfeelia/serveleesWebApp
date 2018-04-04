'use strict'

let Validator = require('ajv');
let val = new Validator();

let cardSchema = 
{
	"id": "/card",
	"type": "object",
	"properties":
	{
		"value": 
		{
			"description": "card's value",
			"type": "integer",
			"minimum": 0,
			"maximum": 12
		},
		"mark":
		{
			"description": "card's mark",
			"type": "integer",
			"minimum": 0,
			"maximum": 3
		}
	},
	"additionalProperties": false,
	"required": ["value", "mark"]
};

let userSchema =
{
	"id": "/user",
	"type": "object",
	"properties":
	{
		"name":
		{
			"description": "user's unique name",
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"hashPassword": 
		{
			"type": "string"
		},
		"email":
		{
			"type": "string",
			"format": "email"
		}
	},
	"additionalProperties": false,
	"required": ["name", "hashPassword"]
}

let putPokerGameSchema =
{
	"id": "/pokerGame",
	"type": "object",
	"properties":
	{
		"name":
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"private": 
		{
			"type": "boolean"
		},
		"minBet":
		{
			"type": "integer",
			"minimum": 0
		},
		"baseStack":
		{
			"type": "integer",
			"minimum": 0
		},
		"ante":
		{
			"type": "integer",
			"minimum": 0
		}	
	},
	"additionalProperties": false,
	"required": ["name"]
}
let getPokerGamesSchema = 
{
	"id": "/getGames",
	"type": "object",
	"properties":
	{
		"filterBy":   
		{
			"type": "string",
			"enum": ["name", "date", "playersNumber"]
		}
	},
	"additionalProperties": false
};
let getPokerGameSchema = 
{
	"id": "/getGame",
	"type": "object",
	"properties":
	{
		
	},
	"additionalProperties": false
}
let postPokerGameSchema = 
{
	"id": "/postPokerGame",
	"type": "object",
	"properties":
	{
		"name":
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"private": 
		{
			"type": "boolean"
		},
		"minBet":
		{
			"type": "integer",
			"minimum": 0
		},
		"baseStack":
		{
			"type": "integer",
			"minimum": 0
		},
		"ante":
		{
			"type": "integer",
			"minimum": 0
		}	
	},
	"additionalProperties": false
}
let deletePokerGameSchema = 
{
	"id": "/deletePokerGame",
	"type": "object",
	"properties":
	{
		
	},
	"additionalProperties": false
}
let getUserSchema = 
{
	"id": "/getUser",
	"type": "object",
	"properties":
	{
	},
	"additionalProperties": false
};
let deleteUserSchema = 
{
	"id": "/deleteUser",
	"type": "object",
	"properties":
	{
	},
	"additionalProperties": false
};
let postUserSchema = 
{
	"id": "/postUser",
	"type": "object",
	"properties":
	{
		"name":
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"email": 
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"newPassword":
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"oldPassword":
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		}
		
	},
	"additionalProperties": false
};
let putUserSchema = 
{
	"id": "/putUser",
	"type": "object",
	"properties":
	{
		"name":
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"email": 
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		"password":
		{
			"type": "string",
			"minLength": 3,
			"maxLength": 20
		},
		
	},
	"additionalProperties": false,
	"required": ["name", "password"]
};
val.addSchema(getPokerGamesSchema, "getPokerGames");

val.addSchema(putPokerGameSchema, "putPokerGame");
val.addSchema(deletePokerGameSchema, "deletePokerGame");
val.addSchema(postPokerGameSchema, "postPokerGame");
val.addSchema(getPokerGameSchema, "getPokerGame");

val.addSchema(putUserSchema, "putUser");
val.addSchema(deleteUserSchema, "deleteUser");
val.addSchema(postUserSchema, "postUser");
val.addSchema(getUserSchema, "getUser");

val.addSchema(cardSchema, "card");
val.addSchema(userSchema, "user");
module.exports = val;