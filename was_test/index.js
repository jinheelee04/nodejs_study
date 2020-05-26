var express    = require('express');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'testuser',
  password : '1234',
  port :3006,
  database : 'test_db'
});


function handleDisconnect() {
  connection.connect(function(err) {            
    if(err) {                            
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); 
    }                                   
  });                                 
                                         
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      return handleDisconnect();                      
    } else {                                    
      throw err;                              
    }
  });
}




var app = express();

// configuration ===============================================================
app.set('port', process.env.PORT || 3006);

app.get('/', function(req, res){
  
  res.send('Root');
});

//client 정보조회
app.get('/clients', function(req, res){
  handleDisconnect();
  connection.query('SELECT * from client_info', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
  connection.end();
});

//client 및 zone 정보조회
app.get('/zone', function(req, res){
  var sql ="select c.client_id, c.client_name, z.zone_id, z.zone_name from client_info AS c join zone_info as z on c.client_id = z.client_id";
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });
  connection.end();
});

//client_info 테이블  데이터 추가
app.get('/clients/add',(req, res)=>{
  var sql = "INSERT INTO client_info (client_id, client_name) VALUES ?";
  var values = [
    [ 10, 'test1'],
    [ 11, 'test2']
  ];

  connection.query(sql, [values], function(err, result, field){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server  Error');
    }
    res.redirect('/success');
  });
  connection.end();
});

//zone_info 테이블  데이터 추가
app.get('/zone/add',(req, res)=>{
  var sql = "INSERT INTO zone_info (client_id, zone_id, zone_name) VALUES ?";
  var values = [
    [ 1, 1, 'zone1'],
    [ 1, 2,'zone2']
  ];

  connection.query(sql, [values], function(err, result, field){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server  Error');
    }
    res.redirect('/success');
  });
  connection.end();
});

//성공시 메세지 출력
app.get('/success', function(req, res){
  res.send('insert 성공');
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});