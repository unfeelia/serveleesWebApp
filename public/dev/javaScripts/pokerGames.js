'use strict'
let list = $("#gamesList");
let temp = null;

$('#notLogedMessage').hide();

let updateGame = (game)=>
{
	$.ajax(
	{
	url: '/dev/api/poker/pokergame/' + game.attr('id'),
	method: 'GET',
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
	},
	success: function(res)
	{
		//console.log(game);
		//let game = $('<il></il>').attr('id', res.id).addClass('gameInfo');
		//console.log(temp[i]);
		game.find('.gameName').replaceWith( $("<pre>\n Name: " + res.name + "</pre>").addClass('gameName'));
		game.find('.gameDateOfCreating') .replaceWith(  $("<pre>\n started at: " + res.dateOfBeggining + "</pre>").addClass('gameDateOfCreating'));
		game.find('.gameId').replaceWith(  $("<pre>\n ID: " + res.id + "</pre>").addClass('gameId'));
		game.find('.gameAnte').replaceWith(  $("<pre>\n ante: " + res.ante + "</pre>").addClass('gameAnte'));
		game.find('.gameBaseStack').replaceWith(  $("<pre>\n baseStack: " +res.baseStack + "</pre>").addClass('gameBaseStack'));
		game.find('.gameMinBet').replaceWith(  $("<pre>\n Minimal Bet: " + res.minBet + "</pre>").addClass('gameMinBet'));
		game.find('.gameHosterInfo').replaceWith(  $("<pre>\n Hoster Name: " + res.hosterName + "\nHoster Id: " + res.hostId + "</pre>").addClass('gameHosterInfo'));
		game.find('.gamePlayersNumber').replaceWith(  $("<pre>\n Players in: " + res.players.length + "</pre>").addClass('gamePlayersNumber'));

		game.find('.gamePlayerList').replaceWith(  $('<ol>Players: </ol>').addClass('gamePlayerList'));
		//console.log(res);
		
		for(let j = 0; j < res.players.length; ++j)
		{
			let playerInfo = $('<li></li>');
			//console.log(res.players[j]);
			let name = $("<pre>\n Player Name: " + res.players[j].name + "</pre>").addClass('playerName');
			//console.log(res.players[j].name);
			let id = $("<pre>\n Player ID: " + res.players[j]._id + "</pre>").addClass('playerId');
			playerInfo.append(name);
			playerInfo.append(id);
			if(res.players[j].name === localStorage.getItem('name'))
				playerInfo.addClass('mineInfo');
			//console.log(res.players[j].name + " " + res.players[j]._id);
			game.find('.gamePlayerList').append(playerInfo);
		}
		//console.log(game);
		return game;
		//console.log(game);
	}
	})
	.fail(res=>
	{
		game.remove();
	})
	.then(res=>
	{
	});
}

let createButton = $('<button></button>').text('Create').attr({'class': 'createGameButton nav-error', 'hidden': false});
createButton.click((event)=>
				{
					event.preventDefault();
					let body = {};
					body['name'] = "test";
					$.ajax({
						url: '/dev/api/poker/pokergame',
						method: 'PUT',
						//contentType: 'application/json',
						data: body,
						beforeSend: function(request) 
						{
							request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
							console.log(request);
							//console.log("JWT" + localStorage.getItem('jwt'));
						}
					})
					.done(data=>
					{
						console.log(data);
						let game = $('<il></il>').attr('id', data.id).addClass('gameInfo');
				//console.log(temp[i]);
				let playersNumber = $("<pre>\n Players in: " + data.players.length + "</pre>").addClass('gamePlayersNumber');
				let name = $("<pre>\n Name: " + data.name + "</pre>").addClass('gameName');
				let dateOfCreating = $("<pre>\n started at: " + data.dateOfBeggining + "</pre>").addClass('gameDateOfCreating');
				let id = $("<pre>\n ID: " + data.id + "</pre>").addClass('gameId');
				let ante = $("<pre>\n ante: " + data.ante + "</pre>").addClass('gameAnte');
				let baseStack = $("<pre>\n baseStack: " + data.baseStack + "</pre>").addClass('gameBaseStack');
				let minBet = $("<pre>\n Minimal Bet: " + data.minBet + "</pre>").addClass('gameMinBet');
				let hoster = $("<pre>\n Hoster Name: " + localStorage.getItem('name') + "\nHoster Id: " + data.hostId + "</pre>").addClass('gameHosterInfo');
				//console.log(data.hosterName);
				let playerList = $('<ol>Players: </ol>').addClass('gamePlayerList');
				//console.log(temp[i].players);
				
				for(let j = 0; j < data.players.length; ++j)
				{
					let playerInfo = $('<li></li>');
					//console.log(temp[i].players[j]);
					let name = $("<pre>\n Player Name: " + localStorage.getItem('name') + "</pre>").addClass('playerName');
					let id = $("<pre>\n Player ID: " + localStorage.getItem('id') + "</pre>").addClass('playerId');
					playerInfo.append(name);
					playerInfo.append(id);
					if(data.players[j].name === localStorage.getItem('name'))
						playerInfo.addClass('mineInfo');
					playerList.append(playerInfo);
				}
				
				let alwaysVisibleContent = $('<div></div>');
				alwaysVisibleContent.addClass('alwaysVisibleContentAboutGame');
				alwaysVisibleContent.append(name);
				alwaysVisibleContent.append(id);
				alwaysVisibleContent.append(hoster);
				alwaysVisibleContent.append(playersNumber);
				alwaysVisibleContent.click(()=>
				{
					let hidden = game.children('.hiddenContentAboutGame').attr('hidden') === 'hidden';
					//console.log(hidden);
					if(hidden)
						game.children('.hiddenContentAboutGame').attr('hidden', false);
					else
						game.children('.hiddenContentAboutGame').attr('hidden', true);
				});
				
				let hiddenContent = $('<div></div>');
				hiddenContent.addClass('hiddenContentAboutGame');
				hiddenContent.attr('hidden', true);
				hiddenContent.append(dateOfCreating);
				hiddenContent.append(ante);
				hiddenContent.append(baseStack);
				hiddenContent.append(minBet);
				hiddenContent.append(playerList);
				hiddenContent.click(()=>
				{
					let hidden = game.children('.hiddenContentAboutGame').attr('hidden') === 'hidden';
					//console.log(hidden);
					if(!hidden)
						game.children('.hiddenContentAboutGame').attr('hidden', true);
				});
				
				game.append(alwaysVisibleContent);
				game.append(hiddenContent);
				
				let joinButton = $('<button></button>').text('Join').attr({'class': 'joinGameButton'});
				let openButton = $('<button></button>').text('Open').attr({'class': 'openGameButton'});
				let leaveButton = $('<button></button>').text('Leave').attr({'class': 'leaveGameButton', 'hidden': true});
				
				joinButton.attr('hidden', true);
				leaveButton.attr('hidden', false);
			
				
				game.append(joinButton);
				game.append(leaveButton);
				game.append(openButton);
				joinButton.click(()=>
				{
					$.ajax({
						url: '/dev/api/poker/pokergame/' + joinButton.parent().attr('id') + '/join',
						method: 'POST',
						contentType: 'application/json',
						//data: {asd: 'asd'},
						beforeSend: function(request) 
						{
							request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
							//console.log("JWT" + localStorage.getItem('jwt'));
						}
					})
					.done(data=>
					{
						joinButton.attr('hidden', true);
						leaveButton.attr('hidden', false);
						updateGame(joinButton.parent());
					})
					.always(data=>
					{
						
					})
					.fail(data=>
					{
					})
					.then(data=>
					{
						
					});
				});
				leaveButton.click(()=>
				{
					$.ajax({
						url: '/dev/api/poker/pokergame/' + leaveButton.parent().attr('id') + '/leave',
						method: 'POST',
						contentType: 'application/json',
						//data: {asd: 'asd'},
						beforeSend: function(request) 
						{
							request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
							//console.log("JWT" + localStorage.getItem('jwt'));
						}
					})
					.done(data=>
					{
						console.log('leaved');
						joinButton.attr('hidden', false);
						leaveButton.attr('hidden', true);
						//let temp = game;
						updateGame(leaveButton.parent());
						//game.replaceWith(updateGame(temp));
						//console.log(game);
					})
					.always(data=>
					{
						
					})
					.fail(data=>
					{
						game.hide();
					})
					.then(data=>
					{
						
					});
				});
				openButton.click(()=>
				{
					//window.location.replace('/dev/pokergame/' + temp[i].id);
					window.open('/dev/pokergame/' + data.id, '_blank');
					window.focus();
				});
				list.append(game);
						
					})
					.always(data=>
					{
						
					})
					.fail(data=>
					{
						console.log(data);
					})
					.then(data=>
					{
						
					});
				});

$('body').append(createButton);
if(localStorage.getItem('jwt'))
{
$.ajax(
{
	url: '/dev/api/poker/pokergames',
	method: 'GET',
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
	},
	success: function(res)
	{
		$('#notLogedMessage').hide();
		temp = res;
		for(let i = 0; i < temp.length; ++i)
		{
				let game = $('<il></il>').attr('id', temp[i].id).addClass('gameInfo');
				//console.log(temp[i]);
				let playersNumber = $("<pre>\n Players in: " + temp[i].players.length + "</pre>").addClass('gamePlayersNumber');
				let name = $("<pre>\n Name: " + temp[i].name + "</pre>").addClass('gameName');
				let dateOfCreating = $("<pre>\n started at: " + temp[i].dateOfBeggining + "</pre>").addClass('gameDateOfCreating');
				let id = $("<pre>\n ID: " + temp[i].id + "</pre>").addClass('gameId');
				let ante = $("<pre>\n ante: " + temp[i].ante + "</pre>").addClass('gameAnte');
				let baseStack = $("<pre>\n baseStack: " + temp[i].baseStack + "</pre>").addClass('gameBaseStack');
				let minBet = $("<pre>\n Minimal Bet: " + temp[i].minBet + "</pre>").addClass('gameMinBet');
				let hoster = $("<pre>\n Hoster Name: " + temp[i].hosterName + "\nHoster Id: " + temp[i].hostId + "</pre>").addClass('gameHosterInfo');

				let playerList = $('<ol>Players: </ol>').addClass('gamePlayerList');
				//console.log(temp[i].players);
				
				for(let j = 0; j < temp[i].players.length; ++j)
				{
					let playerInfo = $('<li></li>');
					//console.log(temp[i].players[j]);
					let name = $("<pre>\n Player Name: " + temp[i].players[j].name + "</pre>").addClass('playerName');
					let id = $("<pre>\n Player ID: " + temp[i].players[j]._id + "</pre>").addClass('playerId');
					playerInfo.append(name);
					playerInfo.append(id);
					if(temp[i].players[j].name === localStorage.getItem('name'))
						playerInfo.addClass('mineInfo');
					playerList.append(playerInfo);
				}
				
				let alwaysVisibleContent = $('<div></div>');
				alwaysVisibleContent.addClass('alwaysVisibleContentAboutGame');
				alwaysVisibleContent.append(name);
				alwaysVisibleContent.append(id);
				alwaysVisibleContent.append(hoster);
				alwaysVisibleContent.append(playersNumber);
				alwaysVisibleContent.click(()=>
				{
					let hidden = game.children('.hiddenContentAboutGame').attr('hidden') === 'hidden';
					//console.log(hidden);
					if(hidden)
						game.children('.hiddenContentAboutGame').attr('hidden', false);
					else
						game.children('.hiddenContentAboutGame').attr('hidden', true);
				});
				
				let hiddenContent = $('<div></div>');
				hiddenContent.addClass('hiddenContentAboutGame');
				hiddenContent.attr('hidden', true);
				hiddenContent.append(dateOfCreating);
				hiddenContent.append(ante);
				hiddenContent.append(baseStack);
				hiddenContent.append(minBet);
				hiddenContent.append(playerList);
				hiddenContent.click(()=>
				{
					let hidden = game.children('.hiddenContentAboutGame').attr('hidden') === 'hidden';
					//console.log(hidden);
					if(!hidden)
						game.children('.hiddenContentAboutGame').attr('hidden', true);
				});
				
				game.append(alwaysVisibleContent);
				game.append(hiddenContent);
				
				let joinButton = $('<button></button>').text('Join').attr({'class': 'joinGameButton'});
				let openButton = $('<button></button>').text('Open').attr({'class': 'openGameButton'});
				let leaveButton = $('<button></button>').text('Leave').attr({'class': 'leaveGameButton', 'hidden': true});
				
				for(let j = 0; j < temp[i].players.length; ++j)
				{
					if(temp[i].players[j].name === localStorage.getItem('name'))
					{
						joinButton.attr('hidden', true);
						leaveButton.attr('hidden', false);
						break;
					}
				}
			
				
				game.append(joinButton);
				game.append(leaveButton);
				game.append(openButton);
				joinButton.click(()=>
				{
					$.ajax({
						url: '/dev/api/poker/pokergame/' + joinButton.parent().attr('id') + '/join',
						method: 'POST',
						contentType: 'application/json',
						//data: {asd: 'asd'},
						beforeSend: function(request) 
						{
							request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
							//console.log("JWT" + localStorage.getItem('jwt'));
						}
					})
					.done(data=>
					{
						joinButton.attr('hidden', true);
						leaveButton.attr('hidden', false);
						updateGame(joinButton.parent());
					})
					.always(data=>
					{
						
					})
					.fail(data=>
					{
					})
					.then(data=>
					{
						
					});
				});
				leaveButton.click(()=>
				{
					$.ajax({
						url: '/dev/api/poker/pokergame/' + leaveButton.parent().attr('id') + '/leave',
						method: 'POST',
						contentType: 'application/json',
						//data: {asd: 'asd'},
						beforeSend: function(request) 
						{
							request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
							//console.log("JWT" + localStorage.getItem('jwt'));
						}
					})
					.done(data=>
					{
						console.log('leaved');
						joinButton.attr('hidden', false);
						leaveButton.attr('hidden', true);
						//let temp = game;
						updateGame(leaveButton.parent());
						//game.replaceWith(updateGame(temp));
						//console.log(game);
					})
					.always(data=>
					{
						
					})
					.fail(data=>
					{
						game.hide();
					})
					.then(data=>
					{
						
					});
				});
				openButton.click(()=>
				{
					//window.location.replace('/dev/pokergame/' + temp[i].id);
					window.open('/dev/pokergame/' + temp[i].id, '_blank');
					window.focus();
				});
				list.append(game);
		}
	}
})
.always(data=>
{
});
}
else
{
	$('#notLogedMessage').show();
	$('.createGameButton').hide();
}
let updateInfo = ()=>
{
	let games = $('.gameInfo');
	//console.log(games);
	games.each((index, item)=>
	{
		updateGame($(item));
		//console.log(item.id);
	});
	//console.log('info updated');
}

//setInterval(updateInfo, 5000);
