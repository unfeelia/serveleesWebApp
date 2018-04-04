//temporarily(but likely permanently unused)
var express = require('express');
var router = express.Router();
let bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.put('/', function(req, res, next) {
	
	const userData = 
	{
		name: req.body.name, 
		pas: req.body.password, 
		repPas: req.body.repeatedPassword
	};
	let hashedPas = null;
	
	
	
	bcrypt.hash(userData.pas, saltRounds).then(function(hash)
	{
		console.log(hash);
		hashedPas = hash;
		console.log(hashedPas);
		const userDataToDB = {name: userData.name, password: hashedPas};
	
		req.db.collection('users').insert(userDataToDB, (err, result)=>
		{
			if(err)
			{
				res.send({'error': 'an error has occured'});
			}
			else
			{
				res.send(result.ops[0]);
			}
		bcrypt.compare(userData.pas, hashedPas).then((res)=>{console.log(res);})
		});
	});
});
router.post('/:name', function(req, res, next) {
	// const userData = 
	// {
		// name: req.body.name, 
		// pas: req.body.password, 
	// };
	
	// let requestedName = req.params.name;
	// db.collection('users').find({name: requestedName}, (err, user)=>
		// {
			// if(err)
			// {
				// console.log(err.message + 'not found user');
				// res.send(err);
			// }
			// else
			// {
				
				// bcrypt.compare(userData.pas, user.password).then(function(result)
					// {
					// if(result)
					// {
						// res.error = null;
						// console.log("valid password");//delete after developing
					// }
					// else
					// {
						// res.error = new Error('not valid password');
						// console.log("invalid password");//delete after developing
					// }
				// });
			// }
		// });
	//console.log("db password: " + 123);
	res.send();
});
module.exports = router;
