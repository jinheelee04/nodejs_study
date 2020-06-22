'use strict';
const userModel = require('../../models/user');
var isEmpty = require('is-empty');
const jsonGen = require( '../../common/jsonGenerator');


exports.view= (req,res) =>{
    res.render('user/enroll', { title: '출입자 보안 관제 ' });
}

/**
 * 사용자 정보 등록
 */
exports.enroll= async (req,res) =>{
    if(isEmpty(req.body)){
        res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.'));
        return;
    }

    let insertResult = await userModel.enroll(req.body.userPhone, req.body.userName, req.body.userDept);
    console.log('insertResult=', insertResult);
    if(insertResult.header.code == ERR_CODE.SUCCESS) {

        res.status(201).json(jsonGen.successValue('추가 성공'));
      
      } else {
        let httpErrCode = await convertHttpCode(insertResult.header.code);
        res.status(httpErrCode).json(insertResult);

        return;
      }
}


/**
 * 사용자 번호 검사
 */
exports.check = async (req, res) => {
  if(isEmpty(req.query.userPhone)) {
    res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (userPhone가 없습니다)'));
    return;
  }

  let result = await userModel.get(req.query.userPhone);

  if(result.header.code == ERR_CODE.SUCCESS) {

    res.status(200).json(result);

  }else if(result.header.code ==ERR_CODE.NO_DATA){
    res.status(200).json(result);

  } else {
    let httpErrCode = await convertHttpCode(result.header.code);
    res.status(httpErrCode).json(result);
    return;
  }

};

/**
 * 사용자 관리 페이지 이동 및 부안구역 리스트 출력 
 */
exports.list= async(req,res) =>{


  let result = await userModel.getAll();

  if(result.header.code == ERR_CODE.SUCCESS) {
  
    res.status(200).render('user/list', { title: '출입자 보안 관제 ', results : result.data});

  } else if(result.header.code ==ERR_CODE.NO_DATA){
    res.status(200).render('user/list', { title: '출입자 보안 관제 ', results : null});

  }else {
    let httpErrCode = await convertHttpCode(result.header.code);
    res.status(httpErrCode).json(result);
    return;
  }


}

/**
 * 사용자 정보 삭제
 */
exports.delete = async (req,res) =>{
  if(isEmpty(req.body)){
      res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.)'));
      return;
  }

  let deleteResult = await userModel.del(req.body.userPhone);
  
  if(deleteResult.header.code == ERR_CODE.SUCCESS) {

      res.status(201).json(jsonGen.successValue('삭제 성공'));
    
    } else {
      let httpErrCode = await convertHttpCode(deleteResult.header.code);
      res.status(httpErrCode).json(deleteResult);

      return;
    }
}


/**
 * 사용자 정보 수정
 */
exports.update = async (req,res) =>{
  if(isEmpty(req.body)){
      res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.)'));
      return;
  }

  let updateResult = await userModel.update(req.body.userName, req.body.userDept, req.body.userPhone);
  
  if(updateResult.header.code == ERR_CODE.SUCCESS) {

      res.status(201).json(jsonGen.successValue('업데이트 성공'));
    
    } else {
      let httpErrCode = await convertHttpCode(updateResult.header.code);
      res.status(httpErrCode).json(updateResult);

      return;
    }
}