'use strict';
const mysql = require('mysql2/promise');
const cfg = require('../config/cfg');
const pool = mysql.createPool(cfg.db);
const jsonGen = require(  '../common/jsonGenerator');
var isEmpty = require('is-empty');


const get = async(userPhone) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query('select * from location_tb where user_phone = ?', [userPhone]);
            connection.release();

            if(isEmpty(rows)) {
            
                return jsonGen.failValue(ERR_CODE.NO_DATA, 'no_data' );
            } else {
                
                return jsonGen.successValue(rows);
            }
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

const add = async(userPhone, userLong, userLat, floorInf, statusCode ) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'insert into location_tb (user_phone, user_long, user_lat, floor_inf, status_code , update_date) values ( ?, ?, ?, ?, ?, default)';
            let params = [userPhone, userLong, userLat, floorInf, statusCode];

            const [rows] = await connection.query(query,params);
            connection.release();
            var socket = io();
            socket.emit('join',{joinName: 'loc'} ); 
            socket.emit('select');
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

const update = async(userPhone, userLong, userLat, floorInf, statusCode ) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'update location_tb set user_long= ? , user_lat = ? , floor_inf= ?, status_code=?  where user_phone = ?';
            let params = [userLong, userLat, floorInf, statusCode, userPhone];

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

const getAll = async() => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            let query ="select U.user_phone,user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%m:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone)";
            const [rows] = await connection.query(query);
            connection.release();
      
            if(isEmpty(rows)) {
                return jsonGen.failValue(ERR_CODE.NO_DATA, 'no_data' );
            } else {
                
                return jsonGen.successValue(rows);
            }
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

const search = async(keyword) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            let query = "select U.user_phone, user_name, user_dept, location_id, user_long, user_lat, floor_inf, status_code, DATE_FORMAT(update_date, '%Y-%m-%d %H:%m:%s') update_date from user_tb U join location_tb L on (U.user_phone = L.user_phone) where U.user_phone like '%' ? '%' or U.user_name = '%' ? '%' ";
            const [rows] = await connection.query(query, [keyword, keyword]);
            connection.release();

            console.log("rows="+rows);
            if(isEmpty(rows)) {
            
                return jsonGen.failValue(ERR_CODE.NO_DATA, 'no_data' );
            } else {
                return jsonGen.successValue(rows);
            }
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
    get : get,
    add : add,
    update : update,
    getAll : getAll,
    search : search
}
