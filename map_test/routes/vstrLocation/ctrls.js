
'use strict';
const locationModel = require('../../models/location');
var isEmpty = require('is-empty');
const jsonGen = require( '../../common/jsonGenerator');
const userModel = require('../../models/user');
const zoneModel = require('../../models/scrtZone');
const { ERR_CODE } = require('../../common/errorCode');
var statusCode = require('./statusCode');


exports.google= (req,res) =>{

    res.render('vstrLocation/google', { title: '출입자 보안 관제 ' });
}
exports.naver= (req,res) =>{
    res.render('vstrLocation/naver', { title: '출입자 보안 관제 ' });
}
exports.kt= (req,res) =>{
    res.render('vstrLocation/kt', { title: '출입자 보안 관제 ' });
}
exports.kakao= (req,res) =>{
    res.render('vstrLocation/kakao', { title: '출입자 보안 관제 ' });
}

exports.test= (req,res) =>{
    res.render('vstrLocation/test', { title: '출입자 보안 관제 ' });
}

/**
 * 사용자 위치정보 저장 및 업데이트
 */

exports.collect = async (req, res) =>{

    if(isEmpty(req.body)){
        res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.)'));
        return;
    } else {
        if( isEmpty(req.body.userPhone)) {
          res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body의 userPhone가 없습니다)'));
          return;
        }
        if( isEmpty(req.body.userLong)) {
            res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body의 userLong가 없습니다)'));
            return;
        }
        if( isEmpty(req.body.userLat)) {
            res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body의 userLat가 없습니다)'));
            return;
        }
        if( isEmpty(req.body.floorInf)) {
            res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body의 floorInf가 없습니다)'));
            return;
        }

    }


    //user_tb 테이블 조회
    let userResult = await userModel.get(req.body.userPhone);
    // user_tb 테이블에 핸드폰 정보가 없을 경우 
    if(userResult.header.code != ERR_CODE.SUCCESS ){
        let httpErrCode = await convertHttpCode(userResult.header.code);
        res.status(httpErrCode).json(userResult);
        return;
    }

    var userLong = Number(req.body.userLong).toFixed(8);
    var userLat = Number(req.body.userLat).toFixed(8);


    //location_tb 테이블 조회
    let locResult = await locationModel.get(req.body.userPhone);
    

    //scrt_zone_tb 테이블 조회
    let zoneResult = await zoneModel.getAll();

    
    
    //location_tb 조회 성공시 update
    if(locResult.header.code == ERR_CODE.SUCCESS){
        let statusCode;
        if(zoneResult.header.code == ERR_CODE.SUCCESS) {   
            if(req.body.floorInf!='5F'){
                statusCode = "VSCD003";
            }else{
                //상태정보 
                statusCode = await statusCode.calcStatus(zoneResult.data, userLong, userLat);         
            }    
        
        }else if(zoneResult.header.code == ERR_CODE.NO_DATA){
           statusCode = "VSCD003";
        
        } else {
            let httpErrCode = await convertHttpCode(result.header.code);
            res.status(httpErrCode).json(result);
            return;
        }


        let updateResult = await locationModel.update(req.body.userPhone, userLong, userLat, req.body.floorInf, statusCode);
        if(updateResult.header.code == ERR_CODE.SUCCESS) {
        
    
            res.status(201).json(jsonGen.successValue('갱신 성공'));
            
          
          } else {
            let httpErrCode = await convertHttpCode(updateResult.header.code);
            res.status(httpErrCode).json(updateResult);
            return;
          }
       
    }
    //location_tb 조회 실패시 insert
    else if(locResult.header.code == ERR_CODE.NO_DATA){

        let statusCode;
        if(zoneResult.header.code == ERR_CODE.SUCCESS) {   
            if(req.body.floorInf!='5F'){
                statusCode = "VSCD003";
            }else{
                //상태정보 
                statusCode = await statusCode.calcStatus(zoneResult.data, userLong, userLat);         
            }    
        
        }else if(zoneResult.header.code == ERR_CODE.NO_DATA){
           statusCode = "VSCD003";
        
        } else {
            let httpErrCode = await convertHttpCode(result.header.code);
            res.status(httpErrCode).json(result);
            return;
        }
        
        
        let insertResult = await locationModel.add(req.body.userPhone, userLong, userLat, req.body.floorInf, statusCode);
        if(insertResult.header.code == ERR_CODE.SUCCESS) {
    
            res.status(201).json(jsonGen.successValue('갱신 성공'));
    
          
          } else {
            let httpErrCode = await convertHttpCode(insertResult.header.code);
            res.status(httpErrCode).json(insertResult);
            return;
          }
    }else{
        let httpErrCode = await convertHttpCode(locResult.header.code);
        res.status(httpErrCode).json(locResult);
        return;
    }


}