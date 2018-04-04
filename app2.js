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
//app.use(favicon("C:/serverlessApp/public/dev/images/svastika.png"));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//routes available for unauthorizade customers
app.use('/dev/', index);
app.use('/dev/', sign);
app.use('/dev/api', api);

//DELETE AFTER DEVELOPING
//let fs = require('fs');
// app.put('/creategame', (req, res)=>
// {
	// let pg = new pokerGame(req.body);
	// pg.save((err, game)=>
	// {
		// if(err)
		// {
			// return res.status(400).send({error: err});
		// }
		// else
		// {
			// return res.json(game);
		// }
	// }
	// );
// });

// app.get('/video', function(req, res) {
  // const path = 'public/video/sample.mp4'
  // const stat = fs.statSync(path)
  // const fileSize = stat.size
  // const range = req.headers.range

  // if (range) {
    // const parts = range.replace(/bytes=/, "").split("-")
    // const start = parseInt(parts[0], 10)
    // const end = parts[1] 
      // ? parseInt(parts[1], 10)
      // : fileSize-1
    // const chunksize = (end-start)+1
    // const file = fs.createReadStream(path, {start, end})
    // const head = {
      // 'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      // 'Accept-Ranges': 'bytes',
      // 'Content-Length': chunksize,
      // 'Content-Type': 'video/mp4',
    // }

    // res.writeHead(206, head);
    // file.pipe(res);
  // } else {
    // const head = {
      // 'Content-Length': fileSize,
      // 'Content-Type': 'video/mp4',
    // }
    // res.writeHead(200, head)
    // fs.createReadStream(path).pipe(res)
  // }
// });

// app.get('/watching', (req, res)=>
// {
	// if(req.user === undefined)
		// res.send((new Error('not authorized')).message);
	// else
		// res.render('video');
// });

// // middleware function to check if customer authorisade. obviously, next routes not available for everyone
// app.use((req, res, next)=>
// {
	// if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')
	// {
		// jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'restfullapi', (err, decode)=>
		// {
			// if(err) 
			// {
				// req.user = undefined;
			// }
			// else
				// req.user = decode;
			// next();
		// });
	// }
	// else
	// {
		// next();
	// }
// });

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

module.exports = app;
