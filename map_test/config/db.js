'user strict';

var mysql = require('mysql');

var db_config = {
    host : 'localhost',
    database : 'ctrl',
    user : 'ctrl',
    password : 'ctrl.123qwe'
}

var pool = mysql.createPool(db_config);

var getConnection = function(callback){
    pool.getConnection(function(err, connection){
        callback(err, connection);
    });
};

module.exports = getConnection;