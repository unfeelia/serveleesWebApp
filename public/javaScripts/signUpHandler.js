$('#signUpForm').submit(function(event)
{
	event.preventDefault();
	submitForm(submitFormErrorHandler);
});
function submitForm(errorHandler)
{
	let name = $('#signUpName');
	let pas = $('#signUpPassword');
	let repPas = $('#signUpRepeatPassword');
	let errors = [];
	//console.log(errors);//delete_after_developing
	
	if(validator.nickName(name) !== null)
	{
		errors.push(validator.nickName(name));
		//console.log(errors + " error in name");//delete_after_developing
	}
	if(validator.password(pas) !== null)
	{
		errors.push(validator.password(pas));
		//console.log(errors + " error in password");//delete_after_developing
	}

	if(validator.repeatedPassword(pas, repPas) !== null)
	{	
		errors.push(validator.repeatedPassword(pas, repPas));
		//console.log(errors + " error with repeated password");//delete_after_developing
	}

	//console.log(errors);//delete_after_developing
	if(errors.length === 0)
	{
			
		const userData = 
		{
			name: name.val(),
			password: pas.val()
		};
		//console.log(userData);//delete_after_developing
		$.ajax(
		{
			url: '/api/auth/signup',
			method: "PUT",
			data: userData,
		}).done(()=>
		{
			window.location.replace('../');
		});
	}
	else
	{
		errorHandler(errors);
	}
};
function submitFormErrorHandler(errors)
{
	errors.forEach((currentValue, index)=>
	{
		currentValue.objectWithError.next().text(currentValue.message).show().slideUp(3000, ()=>
		{
			currentValue.objectWithError.next().text('');
		});
	});
	errors={};
}