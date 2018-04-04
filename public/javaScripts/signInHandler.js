$('#signInForm').submit(function(event)
{
	event.preventDefault();
	submitForm(submitFormErrorHandler);
});
function submitForm(errorHandler)
{
	//console.log('sign in started');
	let name = $('#signInName');
	let pas = $('#signInPassword');
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

	//console.log(errors);//delete_after_developing
	if(errors.length === 0)
	{
			
		const userData = 
		{
			name: name.val(),
			password: pas.val()
		};
		$.ajax(
		{
			url: '/dev/api/auth/signin',
			method: 'POST',
			data: userData,
			success: function(res, status)
			{
				if(res.error !== null)
				{
					console.log('succesed logging in');
					localStorage.setItem('jwt', res.token);
					localStorage.setItem('name', res.name);
					localStorage.setItem('id', res.id);
					window.location.replace('/dev/');
					//alert(localStorage.getItem('jwt'));
				}
				else
				{
					console.log(res.error.message + ": error");
				}
			}
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
		//console.log(typeof(currentValue.message));
		//console.log('asd');
		currentValue.objectWithError.next().text(currentValue.message).show().slideUp(3000, ()=>
		{
			currentValue.objectWithError.next().text('');
		});
	});
	errors={};
}