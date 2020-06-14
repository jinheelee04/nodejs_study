var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var errorCode = require('./common/errorCode');
var cfg = require('./config/cfg');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//----------------------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------------------
global.appRoot = path.resolve(__dirname);
global.ERR_CODE = errorCode.ERR_CODE;
global.convertHttpCode = errorCode.convertHttpCode;
global.cfg = cfg;

var app = express();
 
// var http = require('http');
// var server = http.Server(app);
 
// var socket = require('socket.io');
// var io = socket(server);
 
// var port = 5000;
 

 
// io.on('connection', function(socket) {
//     console.log('User Join');
// });

//socket io
app.use(express.static(path.join(__dirname, 'public')));
app.use('n_mod', express.static(path.join(__dirname, 'node_modules')));

// app.js의 본문내에 삽입하시면 된다.
var io = require('socket.io').listen(3100);

io.on('connection', function (socket) {
    console.log('connect');
    var instanceId = socket.id;
    socket.on('msg', function (data) {
        console.log(data);
        socket.emit('recMsg', {comment: instanceId + ":" + data.comment+'\n'});
    })
});






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/static',express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


//----------------------------------------------------------------------------------------
// error handler
//----------------------------------------------------------------------------------------
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ msg: err.message })
});

// server.listen(port, function() {
//   console.log('Server On !');
// });

module.exports = app;
