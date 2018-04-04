'use strict'


$('#notLogedMessage').hide();
$('#profileInfo').hide();
$('#changePassword').hide();
$('#changeName').hide();
$('#changeEmail').hide();


$('#changePasswordSubmitButton').click(event=>
{
	event.preventDefault();
	//console.log(event.currentTarget.val());
	let body = {};
	$('#resetPasswordForm').find(':input').each((i, item)=>
	{
		console.log($(item).val() + " " + $(item).attr('name'));
		if($(item).attr('name') === 'oldPassword' || $(item).attr('name') === 'newPassword')
		{
			body[$(item).attr('name')] = $(item).val();
			//console.log(body);
			//console.log(body);
		}
	});
	console.log(body);
	updateUserInfo(body);
	
});
$('#changeNameSubmitButton').click(event=>
{
	event.preventDefault();
	//console.log(event.currentTarget.val());
	let body = {};
	$('#resetNameForm').find(':input').each((i, item)=>
	{
		//console.log($(item).val() + " " + $(item).attr('name'));
		if($(item).attr('name') === 'name')
		{
			body[$(item).attr('name')] = $(item).val();
		}
	});
	//console.log(body);
	updateUserInfo(body);
	
});
$('#changeEmailSubmitButton').click(event=>
{
	event.preventDefault();
	//console.log(event.currentTarget.val());
	let body = {};
	$('#resetEmailForm').find(':input').each((i, item)=>
	{
		//console.log($(item).val() + " " + $(item).attr('name'));
		if($(item).attr('name') === 'email')
		{
			body[$(item).attr('name')] = $(item).val();
		}
	});
	//console.log(body);
	updateUserInfo(body);
	
});
let updateUserInfo = (body)=>
{
	//console.log(body);
	$.ajax(
	{
	url: '/dev/api/users/' + localStorage.getItem('id'),
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
		localStorage.setItem('name', res.name);
		localStorage.setItem('id', res._id);
		localStorage.setItem('jwt', res.token);
		localStorage.setItem('email', res.email);
		let name = $("<p>Name: " + res.name + "</p>");
		let email = $("<p>Email: " + res.email + "</p>");
		let thereIsNoEmail = $("<p>Email: not attached" + "</p>");
		$('#userNameField').empty().append(name).show();
		if(res.email)
		{
			$('#userEmailField').empty().append(email);
		}
		else
		{
			$('#userEmailField').empty().append(thereIsNoEmail);
		}
		$('#profileInfo').show();
		$('#changePassword').show();
		//$('#resetPasswordForm').attr('action', '/dev/api/users/' + localStorage.getItem('id'));
	}
	})
	.fail(res=>
	{
		//console.log(res + "internal error");
		console.log("internal error" + res.errorMessage);
		let message = $("<p>Internal Error.</p>").attr('id', 'internalErrorMessage');
		$('body').append(message);
		console.log(res);
		setTimeout(()=>{message.remove();}, 3000);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.then(res=>
	{
		//console.log(res);
	});
}

if(localStorage.getItem('id'))
{
$.ajax(
	{
	url: '/dev/api/users/' + localStorage.getItem('id'),
	method: 'GET',
	beforeSend: function(request) 
	{
		request.setRequestHeader("Authorization", "JWT " + localStorage.getItem('jwt'));
	},
	success: function(res)
	{
		//console.log(res.token);
		localStorage.setItem('name', res.name);
		localStorage.setItem('id', res._id);
		//console.log(res.token);
		//localStorage.setItem('jwt', res.token);
		localStorage.setItem('email', res.email);
		let name = $("<p>Name: " + res.name + "</p>");
		let email = $("<p>Email: " + res.email + "</p>");
		let thereIsNoEmail = $("<p>Email: not attached" + "</p>");
		$('#userNameField').append(name).show();
		if(res.email)
		{
			$('#userEmailField').append(email);
		}
		else
		{
			$('#userEmailField').append(thereIsNoEmail);
		}
		$('#profileInfo').show();
		$('#changePassword').show();
		$('#changeName').show();
		$('#changeEmail').show();
		//$('#resetPasswordForm').attr('action', updateUserInfo);
	}
	})
	.fail(res=>
	{
		//console.log('fail to get info about user on loading page\n' + res.toObject());
		let message = $("<p>Internal Error.</p>");
		$('body').append(message);
		//$('#resetPasswordForm').hide();
		//$('#profileInfo').hide();
		//$('#changePassword').hide();
	})
	.then(res=>
	{
		//console.log(res);
	});
}
else
{
	//console.log('see me');
	$('#notLogedMessage').show();
}
