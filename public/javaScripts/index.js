'use strict'

let signInButton = $('#signInButton');
let signUpButton = $('#signUpButton');
let logOutButton = $('#logOutButton');
let profileButton = $('#profileButton');
//profileButton.attr('href', '/dev/profile');

let buttonUpdating = ()=>
{
	if(localStorage.getItem('jwt'))
	{
		signUpButton.hide();
		signInButton.hide();
	}
	else
	{
		profileButton.hide();
		logOutButton.hide();
	}
	console.log('asd');
}

buttonUpdating();
signInButton.click(()=>
{
	window.location.replace('/dev/signin');
});
signUpButton.click(()=>
{
	window.location.replace('/dev/signup');
});
logOutButton.click(()=>
{
	localStorage.removeItem('jwt');
	localStorage.removeItem('name');
	localStorage.removeItem('id');
	buttonUpdating();
});
//window.setInterval(buttonUpdating, 100);

