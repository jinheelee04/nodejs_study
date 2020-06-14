
'use strict';
const locationModel = require('../../models/location');
var isEmpty = require('is-empty');
const jsonGen = require( '../../common/jsonGenerator');
const userModel = require('../../models/user');
const { ERR_CODE } = require('../../common/errorCode');

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

    if(isEmpty(req.params.userPhone)) {
        res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (userPhone가 없습니다)'));
        return;
      }else if(isEmpty(req.body)){
        res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.'));
        return;
    }
    //user_tb 테이블 조회
    let userResult = await userModel.get(req.params.userPhone);
    // user_tb 테이블에 핸드폰 정보가 없을 경우 
    if(userResult.header.code != ERR_CODE.SUCCESS ){
        let httpErrCode = await convertHttpCode(userResult.header.code);
        res.status(httpErrCode).json(userResult);
        return;
    }


    //location_tb 테이블 조회
    let locResult = await locationModel.get(req.params.userPhone);
    //location_tb 조회 성공시 update
    if(locResult.header.code == ERR_CODE.SUCCESS){
        let updateResult = await locationModel.update(req.params.userPhone, req.body.userLong, req.body.userLat, req.body.floorInf, req.body.statusCode);
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
       
        let insertResult = await locationModel.add(req.params.userPhone, req.body.userLong, req.body.userLat, req.body.floorInf, req.body.statusCode);
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