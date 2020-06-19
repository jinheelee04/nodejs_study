'use strict';
const mysql = require('mysql2/promise');
const cfg = require('../config/cfg');
const pool = mysql.createPool(cfg.db);
// const sql = require('../config/db.js');
const jsonGen = require(  '../common/jsonGenerator');
var isEmpty = require('is-empty');



const add = async(zoneName, zoneLong, zoneLat, c1Long, c1Lat, c1R1, c1R2, c2Long, c2Lat, c2R1, c2R2) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'insert into scrt_zone_tb (zone_name, zone_long, zone_lat, c1_long, c1_lat, c1_r1, c1_r2, c2_long, c2_lat, c2_r1 , c2_r2, enroll_date) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, default)';
            let params = [zoneName, zoneLong, zoneLat, c1Long, c1Lat, c1R1, c1R2, c2Long, c2Lat, c2R1, c2R2];

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
            let query ="select zone_id, zone_name, zone_long, zone_lat, c1_long, c1_lat, c1_r1, c1_r2, c2_long, c2_lat, c2_r1 , c2_r2, DATE_FORMAT(enroll_date, '%Y-%m-%d %H:%m:%s') enroll_date FROM scrt_zone_tb";
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

const update = async(zoneId, zoneName, zoneLong, zoneLat, c1Long, c1Lat, c1R1, c1R2, c2Long, c2Lat, c2R1, c2R2 ) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'update scrt_zone_tb set zone_name = ?, zone_long=?, zone_lat=?, c1_long=?, c1_lat=?, c1_r1 = ?, c1_r2=?, c2_long=?, c2_lat=?, c2_r1=?, c2_r2=? where zone_id = ?';
            let params = [zoneName, zoneLong, zoneLat, c1Long, c1Lat, c1R1, c1R2, c2Long, c2Lat, c2R1, c2R2 , zoneId];

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

const del = async(zoneId ) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {

            let query = 'delete from scrt_zone_tb where zone_id = ?';

            const [rows] = await connection.query( query, zoneId);
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

const search = async(keyword) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            let query = "select zone_id, zone_name, zone_long, zone_lat, c1_long, c1_lat, c1_r1, c1_r2, c2_long, c2_lat, c2_r1 , c2_r2, DATE_FORMAT(enroll_date, '%Y-%m-%d %H:%m:%s') enroll_date from scrt_zone_tb where zone_name like '%' ? '%' or zone_id=? ";
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

const getOne = async(zoneId) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            let query ="select * FROM scrt_zone_tb where zone_id = ?";
            const [row]= await connection.query(query, zoneId);
            connection.release();
      
            if(isEmpty(row)) {
                return jsonGen.failValue(ERR_CODE.NO_DATA, 'no_data' );
            } else {
                var jsonData = {};
                var header = {code: ERR_CODE.SUCCESS, msg: 'success'};
                jsonData.header = header;
                jsonData.data = row;
                return jsonData;
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
    add : add,
    getAll : getAll,
    update : update,
    del : del,
    search : search,
    getOne: getOne
}
