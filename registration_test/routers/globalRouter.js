const express = require("express");
const routes = require("../routes");

const mysql = require("mysql");
const bodyParser = require("body-parser");
const globalRouter = express();


globalRouter.use(bodyParser.urlencoded({extended:false}));

//connection변수는 연결할 때 사용되는 정보를 담고 있다.
let connection = mysql.createConnection({
    host : 'localhost',
    user : 'testuser',
    password : '1234',
    database : 'test_db'
});

//test
const {home} = require("../controllers/globalController");

globalRouter.get(routes.home, home);



//client 정보 등록 get
globalRouter.get("/sign_up", function(req, res, next){
    res.render('sign_up', {title:'sign up page'});
});


//client 정보 등록 post
globalRouter.post("/sign_up", function(req, res,next){
    var body = req.body;
    console.log("body=",req.body);
  
    connection.query("INSERT INTO client_info (client_id, client_name) VALUES (?, ?)", 
    [body.clientID, body.clientName], function(err, result, field){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server  Error');
        }else{
            console.log('client 정보 등록 성공');
            res.redirect("/");

        }
      });
})

//client 정보 수정 post
globalRouter.post("/clients/update", function(req, res,next){
    var id = req.body.id;
    var name = req.body.name;
    console.log("body=",req.body);
    var sql = "update client_info set client_name=? where client_id = ?"
    connection.query(sql, 
    [name, id], function(err, result, field){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server  Error');
        }else{
            console.log('client 정보 수정 성공');
            res.send({result:true, id:id, name:name});
        }
      });
})
//client 정보 삭제 post
globalRouter.post("/clients/delete", function(req, res,next){
    var data = req.body.data;
    console.log("data=", data);

    var sql = 'delete from client_info where client_id = ?';
    connection.query(sql, data, function(err, result, field){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server  Error');
        }else{
            console.log('client 정보 삭제 성공');
            res.send({result:true, data:data});

        }
      });


})


//zone 정보 등록 get
globalRouter.get("/zone/add", function(req, res, next){
    res.render('zone_add', {title:'zone add page'});
});


//zone 정보 등록 post
globalRouter.post("/zone/add", function(req, res,next){
    var body = req.body;
    console.log("body=",req.body);
    var sql = "INSERT INTO zone_info (client_id, zone_id, zone_name) VALUES (?,?,?)";

    connection.query(sql, 
        [body.clientID, body.zoneID, body.zoneName], function(err, result, field){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server  Error');
        }else{
            console.log('zone 정보 등록 성공');
            res.redirect("/");
        }
      });
})

//zone 정보 수정 post
globalRouter.post("/zone/update", function(req, res,next){
    var id = req.body.id;
    var zoneID = req.body.zoneID;
    var name = req.body.name;
    console.log("body=",req.body);
    var sql = "update zone_info set zone_id=?, zone_name=? where id = ?"
    connection.query(sql, 
    [zoneID, name, id], function(err, result, field){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server  Error');
        }else{
            console.log('zone 정보 수정 성공');
            res.send({result:true, id:id, name:name, zoneID:zoneID});
        }
      });
})
//zone 정보 삭제 post
globalRouter.post("/zone/delete", function(req, res,next){
    var id = req.body.id;
    console.log("body=", req.body);

    var sql = 'delete from zone_info where id = ?';
    connection.query(sql, id, function(err, result, field){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server  Error');
        }else{
            console.log('zone 정보 삭제 성공');
            res.send({result:true, id:id});

        }
      });


})

//전체회원 조회 get
globalRouter.get("/clients", function(req, res, next){
    connection.query("SELECT * FROM client_info;", function(err, result, fields){
        if(err){
          console.log("쿼리문에 오류가 있습니다.");
        }
        else{
          console.log('The solution is: ', result);
          //render() 메서드를 호출 할 때, 쿼리 결과인 products 테이블의 모든 데이터를 콜백 함수에 result 인자로 넘겨준다.
          //result에는 products 테이블의 데이터들이 배열의 형태로 담겨있다.
          res.render('clients', {title:'clients info page', results : result});
        }
      });
});

//아이공간 조회 get
globalRouter.get("/zone", function(req, res, next){
    var sql ="select z.id, c.client_id, c.client_name, z.zone_id, z.zone_name from client_info AS c join zone_info as z on c.client_id = z.client_id";
    connection.query(sql, function(err, result, fields){
        if(err){
          console.log("쿼리문에 오류가 있습니다.");
        }
        else{
            console.log('The solution is: ', result);
          //render() 메서드를 호출 할 때, 쿼리 결과인 products 테이블의 모든 데이터를 콜백 함수에 result 인자로 넘겨준다.
          //result에는 products 테이블의 데이터들이 배열의 형태로 담겨있다.
          res.render('zone', {title:'zone info page', results : result});
        }
      });
});




//로그인 get
globalRouter.get("/login", function(req, res, next){
    res.render('login', {title:'login page'});
});

//로그인 post
globalRouter.post("/login", async function(req, res, next){
    let body = req.body;

    let result = await models.user.findOne({
        where :{
            clientID : body.clientID
        }  
    });
    
    let dbClientName = result.dataValues.clientName;
    let inputClientName = body.clientName;
    
    if(dbClientName == inputClientName){
        console.log("비밀번호 일치");
        res.redirect("/user");
    }else{
        console.log("비밀번호 불일치");
        res.redirect("/user/login");
    }
});

//ajax 테스트
globalRouter.get('/ajax_test', function(req, res, next) {
    res.render("ajax_test");
});


//ajax 테스트
/* POST 호출 처리 */
globalRouter.post('/ajax', function(req, res, next) {

    console.log('POST 방식으로 서버 호출됨');
    //view에 있는 data 에서 던진 값을 받아서
    var msg = req.body.msg;
    msg = '[에코]' + msg;

    //json 형식으로 보내 준다.

    res.send({result:true, msg:msg});

});



module.exports = globalRouter;