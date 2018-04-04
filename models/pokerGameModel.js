let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let userSchema = require('./userModel').schema;
let deckSchema = require('./cardModel').deckSchema;
let cardSchema = require('./cardModel').cardSchema;

let Schema = mongoose.Schema;

let pokerGameSchema = new Schema(
{
	hostId:
	{
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
		unique: [true, 'you can host only one game'],
		validate: [
		{
			validator: (val)=>
			{
				mongoose.model('user').findOne({_id: val}, (err, result)=>
					{
						if(err)
							return false;
						if(result)
							return true;
					});
			},
			msg: "there is no such user to host a game"
		 }
		// {
			// validator: (val)=>
			// {
				// let temp = 
				// mongoose.model('pokerGame').find({hostId: val})
				// .then(function(result)
				// {
					// console.log(this);
					// return result.length < 1
				// })
				// .catch((err)=> {return false;});
				// return temp;
			// },
			// msg: "this user already host another game"
		//}
		]
	},
	name:
	{
		type: String,
		maxlength: 20,
		minlength: 3,
		default: 'classic',
		required: true
	},
	dateOfBeggining: 
	{ 
		type: Date, 
		default: Date.now,
		required: true		
	},
	dateOfEnding:
	{
		type: Date
	},
	bank:
	{
		type: Number,
		min: 0,
		default: 0,
		required: true
	},
	tableCards:
	{
			cardOne: 
			{
				type: cardSchema,
				default: null
			},
			cardTwo: 
			{
				type: cardSchema,
				default: null
			},
			cardThree: 
			{
				type: cardSchema,
				default: null
			},
			cardFour: 
			{
				type: cardSchema,
				default: null
			},
			cardFive: 
			{
				type: cardSchema,
				default: null
			}
	},
	players:
	{
		type:
		[
		{
			player:
			{
				type: Schema.Types.ObjectId,
				ref: 'user',
				required: true
			},
			money: 
			{
				type: Number, 
				min: 0.0
			},
			cardOne: 
			{
				type: cardSchema,
				default: null
			},
			cardTwo: 
			{
				type: cardSchema,
				default: null
			},
			bet:
			{
				type: Number,
				min: 0.0,
				default: 0
			},
			inGame:
			{
				type: Boolean,
				default: false
			}
		}],
		required: true,
		validate: [
		{
			validator: (val)=> 
			{
				let x1 = val.length <= 10;
				return x1;
			}, 
			msg: '{PATH} exceeds the limit of 10'
		},
		{
			validator: (val)=>
			{
				let x2 = true;
				var valuesSoFar = Object.create(null);
				for (let i = 0; i < val.length; i++) 
				{
					var value = val[i].player;
					if (value in valuesSoFar) 
					{
						x2 = false;
						console.log('user already added to this game');
						break;
					}
					valuesSoFar[value] = true;
				}
				return x2;
			},
			msg: "someone tried to sit at more than one chair"
		}
		]
	},
	private: 
	{
		type: Boolean,
		required: true,
		default: false
	},
	minBet:
	{
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	baseStack:
	{
		type: Number,
		required: true,
		default: 500,
		min: 0
	},
	whichPlayerTurn:
	{
		type: Number,
		required: true,
		default: 0,
		max: 9,
		min: 0
	},
	maxBet:
	{
		type: Number,
		default: 0,
		min: 0
	},
	ante:
	{
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	deck:
	{
		type: deckSchema,
		required: true
	},
	finished:
	{
		type: Boolean,
		required: true,
		default: true
	}
},
{
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});


module.exports  = 
{
	schema: pokerGameSchema,
	model: mongoose.model('pokerGame', pokerGameSchema)
};