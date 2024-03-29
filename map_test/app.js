var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var errorCode = require('./common/errorCode');
var cfg = require('./config/cfg');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');
var cookieParser = require('cookie-parser');


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
  var instanceId = socket.id;

  socket.on('join',function () {
      socket.join(instanceId );
      roomName =instanceId ;
  });

  socket.on('select',  async function (data) {

       try {
          const connection = await pool.getConnection(async conn => conn);
        
          try {
            let query =''
            var codeArray = data.statusCode;
  
            if(data.length == 4){
              //사용자 정보 및 위치 정보 조회
              query ="select U.user_phone,user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%i:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone) where L.floor_inf = ?";
              const [rows] = await connection.query(query, data.floorInf);
              connection.release();
        
              socket.emit('receive', { result: rows});
            }else if(data.length == 3){
               query ="select U.user_phone,user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%i:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone) where L.floor_inf = ? and (L.status_code = ? or L.status_code = ? or L.status_code = ?)";
               const [rows] = await connection.query(query, [data.floorInf, codeArray[0],codeArray[1], codeArray[2] ] );

               connection.release();
               socket.emit('receive', { result: rows});
             }else if(data.length == 2){
              query ="select U.user_phone,user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%i:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone) where L.floor_inf = ? and (L.status_code = ? or L.status_code = ?)";
              const [rows] = await connection.query(query, [data.floorInf,codeArray[0], codeArray[1] ]);

              connection.release();
              socket.emit('receive', { result: rows});
            }else if(data.length == 1){
              query ="select U.user_phone,user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%i:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone) where L.floor_inf = ? and L.status_code = ?";
              const [rows] = await connection.query(query, [data.floorInf, codeArray[0]]);

              connection.release();
              socket.emit('receive', { result: rows});
            }else{
              connection.release();
              socket.emit('receive', { result: null});
            }

    
          } catch(err) {
            connection.release();
              console.log('Query Error : ' + err);
          }
      } catch(err) {

          console.log('DB Error : ' + err);

      }  
  });

  socket.on('selectOne',  async function (data) {
        try {
          const connection = await pool.getConnection(async conn => conn);
          // connection.query( 'select * from location_tb');
          try {
              let query ="select U.user_phone,user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%i:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone) where U.user_phone = ?";
              const [rows] = await connection.query(query, data.userPhone);
              connection.release();
              let [result] = rows;
              // app.io.sockets.in(roomName).emit('receive', { result: rows});
              socket.emit('receiveOne', { result: result});
    
          } catch(err) {
            connection.release();
              console.log('Query Error : ' + err);
          }
      } catch(err) {

          console.log('DB Error : ' + err);

      }  
    });

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


//쿠키와 세션을 미들웨어로 등록한다
app.use(cookieParser());
 
//세션 횐경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장
app.use(session({
  secret: 'ctrlhubilon',
  resave: false,
  saveUninitialized: true

}));



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
