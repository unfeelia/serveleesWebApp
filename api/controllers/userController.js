'use strict'

let mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcryptjs'),
	user = mongoose.model('user');
	
	
exports.register = function(req, res)
{
	let newUser = new user(req.body);
	
	newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
	newUser.save((err, User)=>
	{
		if(err)
		{
			return res.status(400).send({error: err});
		}
		else
		{
			User.hashPassword = undefined;
			return res.json(User);
		}
	}
	);
}
exports.signIn = function(req, res)
{
	user.findOne({name: req.body.name}, (err, User)=>
		{
			if(err) throw err;
			if(!User)
			{
				return res.status(401).json({message: 'Authentication failed. User not found or Wrong password.'});
			}
			else if(User)
			{
				if(!User.comparePassword(req.body.password))
				{
					return res.status(401).json({message: 'Authentication failed. User not found or Wrong password'});
				}
				else
				{
					return res.json(
					{
						token: jwt.sign({name: User.name, id: User._id}, 'restfullapi'),
						name: User.name,
						id: User._id
					}
					);
				}
			}
		});
}
exports.logInRequired = (req, res, next) =>
{
	if(req.user)
	{
		next();
	}
	else
	{
		return res.status(401).json({message: 'Unauthorized user'});
	}
}