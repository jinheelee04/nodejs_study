var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var errorCode = require('./common/errorCode');
var cfg = require('./config/cfg');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


/* DB 관련 */
const mysql = require('mysql2/promise');
const pool = mysql.createPool(cfg.db);
var isEmpty = require('is-empty');

//----------------------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------------------
global.appRoot = path.resolve(__dirname);
global.ERR_CODE = errorCode.ERR_CODE;
global.convertHttpCode = errorCode.convertHttpCode;
global.cfg = cfg;

var app = express();


//socketio 설정
app.io = require('socket.io')();

var roomName;

app.io.on('connection', function (socket) {
  console.log('connect');

  socket.on('join',function (data) {
      console.log(data);
      socket.join(data.roomName);
      roomName = data.roomName;
  });

  socket.on('select',  async function (data) {

       try {
          const connection = await pool.getConnection(async conn => conn);
          // connection.query( 'select * from location_tb');
          try {
              let query ="select U.user_phone,user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%m:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone) where L.floor_inf = ?";
              const [rows] = await connection.query(query, data.floorInf);
              connection.release();
              console.log("조회 성공 :소켓");
              // app.io.sockets.in(roomName).emit('receive', { result: rows});
              app.io.sockets.emit('receive', { result: rows});
    
          } catch(err) {
            connection.release();
              console.log('Query Error : ' + err);
          }
      } catch(err) {

          console.log('DB Error : ' + err);

      }  
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
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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









module.exports = app;
