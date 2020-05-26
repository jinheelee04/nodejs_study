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
    // let result = models.user.create({
    //     clientID : body.clientID,
    //     clientName : body.clientName
    // })

    // res.redirect("/user/sign_up");
    connection.query("INSERT INTO client_info (client_id, client_name) VALUES (?, ?)", [
        body.clientID, body.clientName
      ], function(){
        res.redirect("/");
      });
})




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

//전체회원 조회 get
globalRouter.get("/clients", function(req, res, next){
    connection.query("SELECT * FROM client_info;", function(err, result, fields){
        if(err){
          console.log("쿼리문에 오류가 있습니다.");
        }
        else{
          //render() 메서드를 호출 할 때, 쿼리 결과인 products 테이블의 모든 데이터를 콜백 함수에 result 인자로 넘겨준다.
          //result에는 products 테이블의 데이터들이 배열의 형태로 담겨있다.
          res.render('clients', {title:'clients info page', results : result});
        }
      });
});


module.exports = globalRouter;