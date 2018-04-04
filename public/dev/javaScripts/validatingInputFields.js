function nickName($Object)
{
	let name = $Object.val();
	let error = null;
	if(name.length === 0)
	{
		error = {};
		error.objectWithError = $($Object);
		error.message = "enter your name";
	}	
	else if(name.length > 30 || name.length < 6)
	{
		error = {};
		error.objectWithError = $Object;
		error.message = name.length > 10 ? "too long":"too short";
	}
	return error;
};
function password($Object)
{
	let name = $Object.val();
	let error = null;
	if(name.length === 0)
	{
		error = {};
		error.objectWithError = $($Object);
		error.message = "enter password";
	}	
	else if(name.length > 10 || name.length < 6)
	{
		error = {};
		error.objectWithError = $Object;
		error.message = name.length > 10 ? "too long":"too short";
	}
	return error;
};
function repeatedPassword($Password, $RepeatedPassword)
{
	let pas = $Password.val();
	let repPas = $RepeatedPassword.val();
	let error = null;
	if(pas !== repPas)
	{
		error = {};
		error.objectWithError = $RepeatedPassword;
		error.message = "passwords are not matched";
	}
	return error;
};
function email($Object)
{
	let email = $Object.val();
	let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	if(!re.test(email))
	{
		error.objectWithError = $Object;
		error.message = "invalid email";
	}
	return error;
};

let validator = {};

validator.nickName = nickName;
validator.password = password;
validator.repeatedPassword = repeatedPassword;
validator.email = email;