'use strict';
const mysql = require('mysql2/promise');
const cfg = require('../config/cfg');
const pool = mysql.createPool(cfg.db);
// const sql = require('../config/db.js');
const jsonGen = require(  '../common/jsonGenerator');
var isEmpty = require('is-empty');



const enroll = async(userPhone, userName, userDept ) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'insert into user_tb (user_phone, user_name, user_dept, enroll_date) values (?,?,?, default)';
            let params = [userPhone, userName, userDept];

            const [rows] = await connection.query(query,params);
            connection.release();
            return jsonGen.successValue(rows);
        } catch(err) {
            console.log('Query Error : ' + err);
            connection.release();
            return jsonGen.failValue(ERR_CODE.DB_ERR, err);
        }
    } catch(err) {
        console.log('DB Error : ' + err);
        return jsonGen.failValue(ERR_CODE.DB_ERR, err);
    }
}

const get = async(userPhone) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query('select * from user_tb where user_phone = ?', [userPhone]);
            connection.release();
            console.log("row="+rows);
            if(isEmpty(rows)) {
            
                return jsonGen.failValue(ERR_CODE.NO_DATA, '등록되지 않은 사용자입니다.' );
            } else {
                
                return jsonGen.successValue(rows);
            }
        } catch(err) {
            console.log('Query Error : ' + err);
            connection.release();
            return jsonGen.failValue(ERR_CODE.DB_ERR, '쿼리문 오류');
        }
    } catch(err) {
        console.log('DB Error : ' + err);
        return jsonGen.failValue(ERR_CODE.DB_ERR, 'DB 연동 오류');
    }
}


const getAll = async(userPhone) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query('select user_name, user_phone, user_dept, DATE_FORMAT(enroll_date, "%Y-%m-%d %H:%i:%s") enroll_date from user_tb order by enroll_date desc ');
            connection.release();
            console.log("row="+rows);
            if(isEmpty(rows)) {
            
                return jsonGen.failValue(ERR_CODE.NO_DATA, '사용자 정보가 없습니다.' );
            } else {
                
                return jsonGen.successValue(rows);
            }
        } catch(err) {
            console.log('Query Error : ' + err);
            connection.release();
            return jsonGen.failValue(ERR_CODE.DB_ERR, '쿼리문 오류');
        }
    } catch(err) {
        console.log('DB Error : ' + err);
        return jsonGen.failValue(ERR_CODE.DB_ERR, 'DB 연동 오류');
    }
}

const del = async(userPhone ) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'delete from user_tb where user_phone = ?';

            const [rows] = await connection.query( query, userPhone);
            connection.release();
            return jsonGen.successValue(rows);
        } catch(err) {
            console.log('Query Error : ' + err);
            connection.release();
            return jsonGen.failValue(ERR_CODE.DB_ERR, err);
        }
    } catch(err) {
        console.log('DB Error : ' + err);
        return jsonGen.failValue(ERR_CODE.DB_ERR, err);
    }
}
const update = async(userName, userDept, userPhone ) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'update user_tb set user_name = ?, user_dept=? where user_phone = ?';
            let params = [userName, userDept, userPhone];

            const [rows] = await connection.query(query,params);
            connection.release();
            return jsonGen.successValue(rows);
        } catch(err) {
            console.log('Query Error : ' + err);
            connection.release();
            return jsonGen.failValue(ERR_CODE.DB_ERR, err);
        }
    } catch(err) {
        console.log('DB Error : ' + err);
        return jsonGen.failValue(ERR_CODE.DB_ERR, err);
    }
}
module.exports = {
    enroll: enroll,
    get : get,
    getAll : getAll,
    del : del,
    update : update
}
