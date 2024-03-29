'use strict';
const zoneModel = require('../../models/scrtZone');
var isEmpty = require('is-empty');
const jsonGen = require( '../../common/jsonGenerator');

/**
 * 보안구역 정보 등록 페이지 이동
 */
exports.view= (req,res) =>{
    res.render('scrtZone/add', { title: '출입자 보안 관제 ' });
}
/**
 * 보안구역 관리 페이지 이동 및 부안구역 리스트 출력 
 */
exports.list= async(req,res) =>{


  let result = await zoneModel.getAll();

  if(result.header.code == ERR_CODE.SUCCESS) {
  
    res.status(200).render('scrtZone/list', { title: '출입자 보안 관제 ', results : result.data});

  } else if(result.header.code ==ERR_CODE.NO_DATA){
    res.status(200).render('scrtZone/list', { title: '출입자 보안 관제 ', results : null});

  }else {
    let httpErrCode = await convertHttpCode(result.header.code);
    res.status(httpErrCode).json(result);
    return;
  }


}

/**
 * 보안구역 정보 등록
 */
exports.add= async (req,res) =>{
    if(isEmpty(req.body)){
        res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.)'));
        return;
    }

    let insertResult = await zoneModel.add(req.body.zoneName, req.body.zoneLong, req.body.zoneLat
                                            , req.body.c1Long, req.body.c1Lat, req.body.c1R1, req.body.c1R2
                                            , req.body.c2Long, req.body.c2Lat, req.body.c2R1, req.body.c2R2);
    
    if(insertResult.header.code == ERR_CODE.SUCCESS) {

        res.status(201).json(jsonGen.successValue('추가 성공'));
      
      } else {
        let httpErrCode = await convertHttpCode(insertResult.header.code);
        res.status(httpErrCode).json(insertResult);

        return;
      }
}


/**
 * 해당 아이디 보안구역 정보 출력 
 */
exports.getOne= async(req,res) =>{

  
  if(isEmpty(req.params.zoneId)){
    res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (zoneId가 없습니다.)'));
    return;
  }

  let result = await zoneModel.getOne(req.params.zoneId);

  var [data] = result.data;

  if(result.header.code == ERR_CODE.SUCCESS) {
  
    res.status(200).render('scrtZone/update', { title: '출입자 보안 관제 ', result : data});

  }else {
    let httpErrCode = await convertHttpCode(result.header.code);
    res.status(httpErrCode).json(result);
    return;
  }


}

/**
 * 보안구역 정보 수정
 */
exports.update = async (req,res) =>{
  if(isEmpty(req.body)){
      res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.)'));
      return;
  }

  let updateResult = await zoneModel.update(req.body.zoneId, req.body.zoneName
                                            , req.body.zoneLong, req.body.zoneLat
                                            , req.body.c1Long, req.body.c1Lat
                                            , req.body.c1R1, req.body.c1R2
                                            , req.body.c2Long, req.body.c2Lat
                                            , req.body.c2R1, req.body.c2R2);
  
  if(updateResult.header.code == ERR_CODE.SUCCESS) {
      res.status(201).json(jsonGen.successValue('업데이트 성공'));
  } 
  else {
      let httpErrCode = await convertHttpCode(updateResult.header.code);
      res.status(httpErrCode).json(updateResult);

      return;
    }
}

/**
 * 보안구역 정보 삭제
 */
exports.delete = async (req,res) =>{
  if(isEmpty(req.body)){
      res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.)'));
      return;
  }

  let deleteResult = await zoneModel.del(req.body.zoneId);
  
  if(deleteResult.header.code == ERR_CODE.SUCCESS) {
      res.status(201).json(jsonGen.successValue('삭제 성공'));  
  } 
  else {
      let httpErrCode = await convertHttpCode(deleteResult.header.code);
      res.status(httpErrCode).json(deleteResult);

      return;
    }
}


/**
 * 보안구역 검색
 */
exports.search= async(req,res) =>{

  if(isEmpty(req.params.keyword)){
    res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (keyword가 없습니다.)'));
    return;
  }

  let result = await zoneModel.search(req.params.keyword);

  if(result.header.code == ERR_CODE.SUCCESS) {
  
    res.status(200).render('scrtZone/list', { title: '출입자 보안 관제 ', results : result.data});

  } else if(result.header.code ==ERR_CODE.NO_DATA){
    res.status(200).render('scrtZone/list', { title: '출입자 보안 관제 ', results : null});

  }else {
    let httpErrCode = await convertHttpCode(result.header.code);
    res.status(httpErrCode).json(result);
    return;
  }
}
