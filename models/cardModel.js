let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let shuffle = function( array, b )
{

 var i = array.length, j, t;

 while( i ) 

 {

  j = Math.floor( ( i-- ) * Math.random() );

  t = b && typeof array[i].shuffle!=='undefined' ? array[i].shuffle() : array[i];

  array[i] = array[j];

  array[j] = t;

 }

 return array;

};

let Schema = mongoose.Schema;

let deckTemp = [];
for(let i = 0; i < 13; ++i)
{
	for(let j = 0; j < 4; ++j)
	{
		deckTemp.push({value: i, mark: j});
	}
}

let card = new Schema(
{
	value:
	{
		type: Number,
		min: 0,
		max: 12,
		required: [true, 'card must have value']
	},
	mark:
	{
		type: Number,
		min: 0,
		max: 3,
		required: [true, 'card must have mark']
	}
}
);
let cardDeck = new Schema(
{
	cards:
	{
		type: [card],
		required: [true, 'there must be cards in deck'],
		default: shuffle(deckTemp)
	}
}
);

module.exports  = 
{
	cardSchema: card,
	cardModel: mongoose.model('card', card),
	deckSchema: cardDeck,
	deckModel: mongoose.model('cardDeck', cardDeck)
};