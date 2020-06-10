'use strict';
const mysql = require('mysql');


let connection = mysql.createConnection({
    host : 'localhost',
    user : 'ctrl',
    password : 'ctrl.123qwe',
    database : 'ctrl'
});

const add = (userPhone, userName, userDept ) => {

    let query = 'insert into user_tb (user_phone, user_name, user_dept, enroll_date) values (?,?,?, default)';
    let params = [userPhone, userName, userDept];
    connection.query(query, params , function(err, result, field){
        if(err){
            console.log(err);
            return; 
            //res.status(500).send('Internal Server  Error');
        }else{
            // console.log('회원 정보 등록 성공');
            // res.json({msg:true});

        }
      });
}


module.exports = {
    add: add
}