'use strict'

//document.body.style.backgroundColor = 'black';
//let image = $('<img>').attr({'id': 'cardDeck', 'hidden': true, 'src': '/dev/images/deck.png'}).appendTo($('body'));
let hosterName = null;
let gameId = $('#gameId').text();
let socket = null;
window.onload = ()=>
{
socket = io();
//console.log(window.location.host.toString() + '/dev/pokergame/' + gameId);
//console.log(socket);
// socket.on('up', (data)=>
// {
	// console.log('update game info');
	// updateGameInfo();
 // });
socket.on('connect', (data)=>
{
	console.log('connected');
	//updateGameInfo();
});
socket.on('update', (data)=>
{
	//console.log('we are here');
	console.log("UPDATE  :: :" + data.id + " " + gameId);
	if(data.id && data.id.toString() === gameId)
	{
		updateGameInfo();
	}
	console.log(data + "update event excecuted");
	//socket.emit('join', 'hello world');
});
updateGameInfo();
}


$('body').css({width: '90%'});
let canvas = $('<canvas></canvas>');
// canvas.height = window.innerHeight * 0.25;
// canvas.width = window.innerWidth * 0.25;
canvas.attr('width', window.innerWidth * 0.75);
canvas.attr('height', window.innerHeight * 0.75);
canvas.css( {
    'padding-left': 0,
    'padding-right': 0,
    'margin-left': 'auto',
    'margin-right': 'auto',
    'display': 'block'
} );


let updateGameInfo = ()=>
{
	$.ajax(
	{
	url: '/dev/api/poker/pokergame/' + gameId,
	method: 'GET',
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
	},
	success: function(res)
	{
		console.log(res);
		hosterName = res.hosterName;
		localStorage.setItem(gameId + '_ante', res.ante);
		localStorage.setItem(gameId + '_bank', res.bank);
		localStorage.setItem(gameId + '_' + 'baseStack', res.baseStack);
		localStorage.setItem(gameId + '_' + 'dateOfBeggining', res.dateOfBeggining);
		localStorage.setItem(gameId + '_' + 'finished', res.finished);
		localStorage.setItem(gameId + '_' + 'hostId', res.hostId);
		localStorage.setItem(gameId + '_' + 'hosterName', res.hosterName);
		//console.log(res.hosterName);
		//console.log(localStorage.getItem(gameId + '_' + 'hosterName'));
		localStorage.setItem(gameId + '_' + 'id', res.id);
		localStorage.setItem(gameId + '_' + 'maxBet', res.maxBet);
		localStorage.setItem(gameId + '_' + 'minBet', res.minBet);
		localStorage.setItem(gameId + '_' + 'name', res.name);
		localStorage.setItem(gameId + '_' + 'private', res.private);
		localStorage.setItem(gameId + '_' + 'whichPlayerTurn', res.whichPlayerTurn);
		for(let i = 0; i < res.players.length; ++i)
		{
			localStorage.setItem
			(gameId + '_' + 'player' + '_' + i + '_id', res.players[i]._id);
			localStorage.setItem
			(gameId + '_' + 'player' + '_' + i + '_bet', res.players[i].bet);
			localStorage.setItem
			(gameId + '_' + 'player' + '_' + i + '_inGame', res.players[i].inGame);
			localStorage.setItem
			(gameId + '_' + 'player' + '_' + i + '_money', res.players[i].money);
			localStorage.setItem
			(gameId + '_' + 'player' + '_' + i + '_name', res.players[i].name);
		}
		if(res.tableCards.cardOne)
		{
		localStorage.setItem(gameId + '_' + 'cardOne_value', res.tableCards.cardOne.value);
		localStorage.setItem(gameId + '_' + 'cardOne_mark', res.tableCards.cardOne.mark);
		}
		if(res.tableCards.cardThree)
		{
		localStorage.setItem(gameId + '_' + 'cardThree_value', res.tableCards.cardThree.value);
		localStorage.setItem(gameId + '_' + 'cardThree_mark', res.tableCards.cardThree.mark);
		}
		if(res.tableCards.cardFour)
		{
		localStorage.setItem(gameId + '_' + 'cardFour_value', res.tableCards.cardFour.value);
		localStorage.setItem(gameId + '_' + 'cardFour_mark', res.tableCards.cardFour.mark);
		}
		if(res.tableCards.cardTwo)
		{
		localStorage.setItem(gameId + '_' + 'cardTwo_value', res.tableCards.cardTwo.value);
		localStorage.setItem(gameId + '_' + 'cardTwo_mark', res.tableCards.cardTwo.mark);
		}
		if(res.tableCards.cardFive)
		{
		localStorage.setItem(gameId + '_' + 'cardFive_mark', res.tableCards.cardFive.mark);
		localStorage.setItem(gameId + '_' + 'cardFive_value', res.tableCards.cardFive.value);
		}
		localStorage.setItem(gameId + '_' + 'player_number', res.players.length);
		localStorage.setItem(gameId + '_' + 'my_number', res.myNumber);
		
		$('canvas').each(function(idx, item) {
			var context = item.getContext("2d");
			context.clearRect(0, 0, item.width, item.height);
			context.beginPath();        
		});
		
		if(res.tableCards.cardOne)
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
			canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition - 125 * 2.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * res.tableCards.cardOne.value, sy: (175 + 12) * res.tableCards.cardOne.mark,
			scale: 0.5
		});
		}
		else
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
			canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition - 125 * 2.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * 13, sy: (175 + 12) * 2,
			scale: 0.5
			})
		}
		if(res.tableCards.cardTwo)
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
		canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition - 125 * 1.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * res.tableCards.cardTwo.value, sy: (175 + 12) * res.tableCards.cardTwo.mark ,
			scale: 0.5
		});
		}
		else
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
			canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition - 125 * 1.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * 13, sy: (175 + 12) * 2,
			scale: 0.5
			})
		}
		if(res.tableCards.cardThree)
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
		canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition - 125 * 0.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * res.tableCards.cardThree.value, sy: (175 + 12) * res.tableCards.cardThree.mark ,
			scale: 0.5
		});
		}
		else
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
			canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition - 125 * 0.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * 13, sy: (175 + 12) * 2,
			scale: 0.5
			})
		}
		if(res.tableCards.cardFour)
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
		canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition + 125 * 0.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * res.tableCards.cardFour.value, sy: (175 + 12) * res.tableCards.cardFour.mark ,
			scale: 0.5
		});
		}
		else
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
			canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition + 125 * 0.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * 13, sy: (175 + 12) * 2,
			scale: 0.5
			})
		}
		if(res.tableCards.cardFive)
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
		canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition + 125 * 1.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * res.tableCards.cardFive.value, sy: (175 + 12) * res.tableCards.cardFive.mark ,
			scale: 0.5
		});
		}
		else
		{
			let xPosition = Number(canvas.attr('width')) / 2;
			let yPosition = Number(canvas.attr('height')) / 2;
			canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition + 125 * 1.5 / 2, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * 13, sy: (175 + 12) * 2,
			scale: 0.5
			})
		}
		
		let angle = Math.PI * 2 / res.players.length;
		let scl = 0.5;
		
		for(let i = 0; i < res.players.length; ++i)
		{
			let yPosition = (Number(canvas.attr('height')) + Math.sin(angle * i) * Number(canvas.attr('height')))/2 * 0.8;
			let xPosition = (Number(canvas.attr('width')) + Math.cos(angle * i) * Number(canvas.attr('width')))/2 * 0.8;
			if(i !== res.myNumber || (i === res.myNumber && res.players[i].cardOne === null))
			{
		canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * 13, sy: (175 + 12) * 2,
			scale: scl
		});
		canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition + 125 * scl, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * 13, sy: (175 + 12) * 2,
			scale: scl
		});
		}
		else
		{canvas.drawImage({
			source: '/dev/images/deck.png',
			x: xPosition, 
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * res.players[i].cardOne.value, sy: (175 + 12) * res.players[i].cardOne.mark,
			scale: scl
		});
		canvas.drawImage({
			x: xPosition + 125 * scl, 
			source: '/dev/images/deck.png',
			y: yPosition,
			//width: 80,
			//height: 100,
			fromCenter: false,
			sWidth: 125,
			sHeight: 175,
			sx: 125 * res.players[i].cardTwo.value, sy: (175 + 12) * res.players[i].cardTwo.mark ,
			scale: scl
		});
		}
		let Text = "Name: " + res.players[i].name + "\n" +
					"Bet: " + res.players[i].bet + "\n" +
					"Ingame: " + res.players[i].inGame + "\n" +
					"Money: " + res.players[i].money;
			//console.log(Text);
			canvas.drawText({
			fillStyle: '#9cf',
			strokeStyle: '#25a',
			strokeWidth: 1,
			fromCenter: false,
			x: xPosition + 125 * 0.3, y: yPosition - 175 * 0.3,
			fontSize: 15,
			fontFamily: 'Verdana, sans-serif',
			text: Text
			});

		}
		$('#hosterName').text(res.hosterName);
		$('#hosterId').text(res.hostId);
		
		let Text = "Bank: " + res.bank;
			//console.log(Text);
			canvas.drawText({
			fillStyle: '#9cf',
			strokeStyle: '#25a',
			strokeWidth: 1,
			fromCenter: false,
			x: Number(canvas.attr('width')) * 0.5, y: Number(canvas.attr('height')) * 0.1,
			fontSize: 15,
			fontFamily: 'Verdana, sans-serif',
			text: Text
			});
		
		if(hosterName === localStorage.getItem('name'))
{
	//console.log('here');
	$('#start').attr('hidden', false);
	$('#startButton').unbind('click');
	$('#startButton').click((event)=>
{
	event.preventDefault();
	$.ajax(
	{
	url: '/dev/api/poker/pokergame/' + gameId + '/start',
	method: 'POST',
	data: {},
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
		//request.
		//console.log(localStorage.getItem('id'));
	},
	success: function(res)
	 {
		updateGameInfo();
		let data = {};
		data.id = gameId;
		socket.emit('up', data); 
	}
	})
	.fail(res=>
	{
		//console.log(res + "internal error");
		console.log("internal error: " + res.errors);
		let message = $("<p>Internal Error.</p>").attr('id', 'internalErrorMessage');
		$('body').append(message);
		console.log("internal error: " + res.responseText);
		setTimeout(()=>{message.remove();}, 3000);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.then(res=>
	{
		//console.log(res);
	});

});
}
	
	}
	})
	.fail(res=>
	{
		//console.log('fail to get info about user on loading page\n' + res.toObject());
		console.log(res);
		let message = $("<p>Internal Error.</p>");
		$('body').append(message);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.then(res=>
	{
		
		if(localStorage.getItem(gameId + '_' + 'finished') === 'true')
		{
			console.log('game finished: ' + localStorage.getItem(gameId + '_' + 'finished'));
			$('#makeFoldButton').attr('disabled', true);
			$('#makeCheckButton').attr('disabled', true);
			$('#makeBetButton').attr('disabled', true);
			$('#startButton').attr('disabled', false);
		}
		else
		{
			$('#startButton').attr('disabled', true);
			console.log('not my turn: ' + localStorage.getItem(gameId + '_' + 'whichPlayerTurn') !== localStorage.getItem(gameId + '_' + 'my_number'));
			if(localStorage.getItem(gameId + '_' + 'whichPlayerTurn') !== localStorage.getItem(gameId + '_' + 'my_number'))
			{
				$('#makeFoldButton').attr('disabled', true);
				$('#makeCheckButton').attr('disabled', true);
				$('#makeBetButton').attr('disabled', true);
			}
			else
			{
				$('#makeFoldButton').attr('disabled', false);
				$('#makeCheckButton').attr('disabled', false);
				$('#makeBetButton').attr('disabled', false);
			}
		}
	});

}

$('body').append(canvas);

$('#makeFoldButton').click((event)=>
{
	socket.emit('up', {id: gameId});
	event.preventDefault();
	$.ajax(
	{
	url: '/dev/api/poker/pokergame/' + gameId + '/fold',
	method: 'POST',
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
		//request.
		//console.log(localStorage.getItem('id'));
	},
	success: function(res)
	{
		updateGameInfo();
		let data = {};
		data.id = gameId;
		socket.emit('up', data); 
	}
	})
	.fail(res=>
	{
		//console.log(res + "internal error");
		console.log("internal error" + res.errorMessage);
		let message = $("<p>Internal Error.</p>").attr('id', 'internalErrorMessage');
		$('body').append(message);
		console.log("internal error: " + res.responseText);
		setTimeout(()=>{message.remove();}, 3000);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.always(res=>
	{
		updateGameInfo();
		//console.log(res);
	});

});
$('#makeCheckButton').click((event)=>
{
	event.preventDefault();
	$.ajax(
	{
	url: '/dev/api/poker/pokergame/' + gameId + '/check',
	method: 'POST',
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
		//request.
		//console.log(localStorage.getItem('id'));
	},
	success: function(res)
	{
		updateGameInfo();
		let data = {};
		data.id = gameId;
		socket.emit('up', data); 
	}
	})
	.fail(res=>
	{
		//console.log(res + "internal error");
		console.log("internal error: " + res.responseText);
		let message = $("<p>Internal Error.</p>").attr('id', 'internalErrorMessage');
		$('body').append(message);
		console.log(res);
		setTimeout(()=>{message.remove();}, 3000);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.always(res=>
	{
		updateGameInfo();
		//console.log(res);
	});

});
$('#makeBetButton').click((event)=>
{
	let body = {};
	$('#makeBetForm').find(':input').each((i, item)=>
	{
		//console.log($(item).val() + " " + $(item).attr('name'));
		if($(item).attr('name') === 'bet')
		{
			body[$(item).attr('name')] = $(item).val();
		}
	});
	event.preventDefault();
	$.ajax(
	{
	url: '/dev/api/poker/pokergame/' + gameId + '/bet',
	method: 'POST',
	data: body,
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
		//request.
		//console.log(localStorage.getItem('id'));
	},
	success: function(res)
	{
		updateGameInfo();
		let data = {};
		data.id = gameId;
		socket.emit('up', data);  
	}
	})
	.fail(res=>
	{
		//console.log(res + "internal error");
		console.log("internal error: " + res.errors);
		let message = $("<p>Internal Error.</p>").attr('id', 'internalErrorMessage');
		$('body').append(message);
		console.log("internal error: " + res.responseText);
		setTimeout(()=>{message.remove();}, 3000);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.always(res=>
	{
		updateGameInfo();
		//console.log(res);
	});

});


console.log(hosterName);
//console.log(localStorage.getItem('5a2dcd728f05d908a0768530_hosterName'));
//console.log(localStorage.getItem('name'));
//console.log($('#hosterName').text() + " tttttet");
if(hosterName === localStorage.getItem('name'))
{
	//console.log('here');
	$('#start').attr('hidden', false);
	$('#startButton').click((event)=>
{
	event.preventDefault();
	$.ajax(
	{
	url: '/dev/api/poker/pokergame/' + gameId + '/start',
	method: 'POST',
	data: {},
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
		//request.
		//console.log(localStorage.getItem('id'));
	},
	success: function(res)
	{
		updateGameInfo();
		let data = {};
		data.id = gameId;
		socket.emit('up', data); 
	}
	})
	.fail(res=>
	{
		//console.log(res + "internal error");
		console.log("internal error: " + res.errors);
		let message = $("<p>Internal Error.</p>").attr('id', 'internalErrorMessage');
		$('body').append(message);
		console.log("internal error: " + res.responseText);
		setTimeout(()=>{message.remove();}, 3000);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.then(res=>
	{
		//console.log(res);
	});

});
}
	
let resCanvas = ()=>
{
canvas.attr('width', window.innerWidth * 0.75);
canvas.attr('height', window.innerHeight * 0.75);
canvas.css( {
    'padding-left': 0,
    'padding-right': 0,
    'margin-left': 'auto',
    'margin-right': 'auto',
    'display': 'block'
} );
updateGameInfo();
}
$(window).resize(resCanvas);
$('#gamemovelist').appendTo($('body'));