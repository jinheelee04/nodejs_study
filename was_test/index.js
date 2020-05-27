var express    = require('express');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'testuser',
  password : '1234',
  database : 'test_db'
});

var app = express();

// configuration ===============================================================
app.set('port', process.env.PORT || 3006);

app.get('/', function(req, res){
  
  res.send('Root');
});

//client 정보조회
app.get('/clients', function(req, res){

  connection.query('SELECT * from client_info', function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });

});
//client 삭제
app.get('/clients/delete', function(req, res){
  var sql = 'delete from client_info where client_id = ?';
  var value = 1;
  connection.query(sql, value, function(err, result, field){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server  Error');
    }
    console.log("delete 성공");
    res.redirect('/success/del');
  });

});

//client 및 zone 정보조회
app.get('/zone', function(req, res){
  var sql ="select z.id, c.client_id, c.client_name, z.zone_id, z.zone_name from client_info AS c join zone_info as z on c.client_id = z.client_id";
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('The solution is: ', rows);
    res.send(rows);
  });

});

//client_info 테이블  데이터 추가
app.get('/clients/add',(req, res)=>{
  var sql = "INSERT INTO client_info (client_id, client_name) VALUES ?";
  var values = [
    [ 1, '송경민'],
    [ 2, '김지훈'],
    [ 3, '김용수'],
    [ 4, '이진희']
  ];

  connection.query(sql, [values], function(err, result, field){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server  Error');
    }
    console.log("insert 성공");
    res.redirect('/success');
  });
 
});

//zone_info 테이블  데이터 추가
app.get('/zone/add',(req, res)=>{
  var sql = "INSERT INTO zone_info (client_id, zone_id, zone_name) VALUES ?";
  var values = [
    [ 2, 4001, '피아노학원'],
    [ 3, 4002,'수학학원'],
    [ 1, 4003, '남강빌딩']
  ];

  connection.query(sql, [values], function(err, result, field){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server  Error');
    }
    console.log("insert 성공");
    res.redirect('/success');
  });

});

//insert 성공시 메세지 출력
app.get('/success', function(req, res){
  res.send('insert 성공');
});
//delete 성공시 메세지 출력
app.get('/success/del', function(req, res){
  res.send('delete 성공');
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});