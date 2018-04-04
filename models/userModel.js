let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let userSchema = new Schema(
{
	name: 
	{ 
	type: String, 
	required: [true, 'name is required'],
	maxlength: 20,
	minlength: 3,
	unique: [true, 'name is already used']
	},
	dateOfRegistration: 
	{ 
	type: Date, 
	default: Date.now 
	},
	email: 
	{
		type: String,
		lowercase: true
		//unique: [true, 'email is already used']
	},
	hashPassword:
	{
		type: String,
		required: [true, 'password is required']
	}
}
);

userSchema.methods.comparePassword = function(password)
{
	return bcrypt.compareSync(password, this.hashPassword);
}

module.exports = 
{
	schema: userSchema,
	model: mongoose.model('user', userSchema)
};