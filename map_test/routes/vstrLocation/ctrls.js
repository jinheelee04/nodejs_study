
'use strict';
const locationModel = require('../../models/location');
var isEmpty = require('is-empty');
const jsonGen = require( '../../common/jsonGenerator');
const userModel = require('../../models/user');
const zoneModel = require('../../models/scrtZone');
const { ERR_CODE } = require('../../common/errorCode');
const getStatusCode = require('./getStatusCode');
const { InsufficientStorage } = require('http-errors');

var sess = "";
exports.google= async (req,res) =>{
    sess = req.session;
    
    if(sess.admin ==null){
       sess.admin = {
           "time" : 3
       }
    }else{
        sess.admin.time = req.session.admin.time;
    }
    
    

    let locResult = await locationModel.getAll();
    let result = await zoneModel.getAll();
    
    let floorInfo_1F = {};
    let floorInfo_5F = {};

    //보안구역 정보 없을 경우
    if(result.header.code == ERR_CODE.NO_DATA){
       result.data = null;

    }


    if(locResult.header.code == ERR_CODE.SUCCESS) {
        
        var cnt_all_1 = 0;
        var cnt_all_5 = 0;
    
        var cnt_code3 = 0;
        var cnt_code4 = 0;
        var cnt_code5 = 0;

        for( var locData of locResult.data){
            if(locData.floor_inf =='1F'){
                cnt_all_1++;

            }else if (locData.floor_inf =='5F'){
                cnt_all_5++;

               if(locData.status_code =='VSCD003'){
                    cnt_code3++;
                }else if(locData.status_code =='VSCD004'){
                    cnt_code4++;    
                }else if(locData.status_code =='VSCD005'){
                    cnt_code5++;
                }
            }
        }      
        
        floorInfo_1F.cnt_all_1 = cnt_all_1;

        floorInfo_5F.cnt_all_5 = cnt_all_5;
        floorInfo_5F.cnt_code3 = cnt_code3;
        floorInfo_5F.cnt_code4 = cnt_code4;
        floorInfo_5F.cnt_code5 = cnt_code5;
  
        res.status(200).render('vstrLocation/google', { title: '출입자 보안 관제 ', results : result.data, 'floorInfo_1F': floorInfo_1F, 'floorInfo_5F' : floorInfo_5F, time : sess.admin.time});
    }else if(locResult.header.code == ERR_CODE.NO_DATA ){
      
        res.status(200).render('vstrLocation/google', { title: '출입자 보안 관제 ', results : result.data, 'floorInfo_1F': null, 'floorInfo_5F' : null, time : sess.admin.time});
   
    } else {
        let httpErrCode = await convertHttpCode(result.header.code);
        res.status(httpErrCode).json(result);
        return;
    }


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
        if( isEmpty(req.body.pdDttm)) {
            res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body의 pdDttm가 없습니다)'));
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
    //20190125060035
    var userLong = Number(req.body.userLong).toFixed(8);
    var userLat = Number(req.body.userLat).toFixed(8);
    //location_tb 테이블 조회
    let locResult = await locationModel.get(req.body.userPhone);
    

    //scrt_zone_tb 테이블 조회
    let zoneResult = await zoneModel.getAll();

    var [zoneDatas] = zoneResult.data; 

    
    let statusCode = req.body.statusCode;

    //location_tb 조회 성공시 update
    if(locResult.header.code == ERR_CODE.SUCCESS){
        if(zoneResult.header.code == ERR_CODE.SUCCESS) {
            
            if(req.body.floorInf == '5F'){
                //상태정보 
                statusCode = await getStatusCode.getStatus(zoneResult.data, userLong, userLat);         
            }    
        
        }else if(zoneResult.header.code == ERR_CODE.NO_DATA && req.body.floorInf =='5F'){
           statusCode = "VSCD003";
        
        } else {
            let httpErrCode = await convertHttpCode(result.header.code);
            res.status(httpErrCode).json(result);
            return;
        }

        //1층인 경우
        if(req.body.floorInf =='1F'){
            statusCode = "VSCD002";
        }

        let updateResult = await locationModel.update(req.body.userPhone, userLong, userLat, req.body.floorInf, statusCode, req.body.pdDttm);
        
        
        if(updateResult.header.code == ERR_CODE.SUCCESS) {
            var statusMsg ='';
            switch(statusCode){
                case 'VSCD002': statusMsg = '1층 출입'; break;
                case 'VSCD003': statusMsg = '정상출입'; break;
                case 'VSCD004': statusMsg = '출입통제구역 부근입니다. 주의 바랍니다.'; break;
                case 'VSCD005': statusMsg = '출입통제구역입니다. 통제구역에서 빨리 벗어나길 바랍니다.'; break;
            }
            
            updateResult.status = {code : statusCode, msg: statusMsg };
            updateResult.data  = "갱신 성공";
      
            res.status(201).json(updateResult);
            
          
          } else {
            let httpErrCode = await convertHttpCode(updateResult.header.code);
            res.status(httpErrCode).json(updateResult);
            return;
          }
       
    }
    //location_tb 조회 실패시 insert
    else if(locResult.header.code == ERR_CODE.NO_DATA){

        if(zoneResult.header.code == ERR_CODE.SUCCESS) {   
            if(req.body.floorInf!='5F'){
                statusCode = "VSCD003";
            }else{
                //상태정보 
                statusCode = await getStatusCode.getStatus(zoneResult.data, userLong, userLat);            
            }    
        
        }else if(zoneResult.header.code == ERR_CODE.NO_DATA){
           statusCode = "VSCD003";
        
        } else {
            let httpErrCode = await convertHttpCode(result.header.code);
            res.status(httpErrCode).json(result);
            return;
        }
        

        let insertResult = await locationModel.add(req.body.userPhone, userLong, userLat, req.body.floorInf, statusCode, req.body.pdDttm);
        if(insertResult.header.code == ERR_CODE.SUCCESS) {
            
            var statusMsg ='';
            switch(statusCode){
                case 'VSCD002': statusMsg = '1층 출입'; break;
                case 'VSCD003': statusMsg = '정상출입'; break;
                case 'VSCD004': statusMsg = '출입통제구역 부근입니다. 주의 바랍니다.'; break;
                case 'VSCD005': statusMsg = '출입통제구역입니다. 통제구역에서 빨리 벗어나길 바랍니다.'; break;
            }
            
            insertResult.status = {code : statusCode, msg: statusMsg };
            insertResult.data  = "갱신 성공";

            res.status(201).json(insertResult);
    
          
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


exports.setTime= async (req,res) =>{

    if(isEmpty(req.body.updateScd)){
        res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (keyword가 없습니다.)'));
        return;
      }
     sess = req.session;
      sess.admin = {
        "time" : Number(req.body.updateScd)
      }

      console.log("여기");
      res.status(200).json({ title: '출입자 보안 관제 ', msg : 'success', time : sess.admin.time});
   
}