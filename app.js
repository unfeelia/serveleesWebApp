'use strict'

const serverless = require('serverless-http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
let mongoose    = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let jsonwebtoken = require('jsonwebtoken');
let socket_io = require('socket.io');

//setting applicatio
var app = express();
let io = socket_io();
app.io = io;
//setting database properties, connection and 
const db = require('./config/db');
mongoose.connect(db.url, {useMongoClient: true});
let dbConnect = mongoose.connection;
dbConnect.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.Promise = global.Promise;
//assert.equal(query.exec().constructor, global.Promise);

//mongoose models
let user = require('./models/userModel').model;
let deck = require('./models/cardModel').deckModel;
// let newDeck = new deck();
// newDeck.save();

//must be below than database part
let userHandlers = require('./api/controllers/userController');

//routes
let index = require('./routes/index')(io);
let sign = require('./routes/sign');
let api = require('./api/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware function for any request
// uncomment after placing your favicon in /public
//app.use(favicon("C:/serverlessApp/public/"));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//routes available for unauthorizade customers
app.use('/', index);
app.use('/', sign);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});



// io.of('/dev/pokergame/:id').on('connection', ()=>
// {
	// console.log('connected to a game');
// })
io.on("connection", function( socket )
{
    //console.log( "A user connected" );
	socket.on('chat message', (msg)=>
	{
		console.log('message: ' + msg);
	})
	socket.on('up', data=>
		{
			//console.log('at least so' + data.id);
			if(data.id)
			{
				//console.log('emited');
				io.emit('update', data);
			}
		});
	socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});
module.exports.handler = serverless(app);
