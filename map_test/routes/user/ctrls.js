'use strict';
const userModel = require('../../models/user');
var isEmpty = require('is-empty');
const jsonGen = require('../../common/jsonGenerator');

exports.view= (req,res) =>{
    res.render('user/enroll', { title: '출입자 보안 관제 ' });
}

exports.enroll= async (req,res) =>{
    if(isEmpty(req.body)){
        res.status(400).json(jsonGen.failValue(ERR_CODE.INVALID_PARAM, '잘못 된 요청 (body가 없습니다.'));
        return;
    }

    let insertResult = await userModel.add(req.body.userPhone, req.body.userName, req.body.userDept);
    if(insertResult.header.code == ERR_CODE.SUCCESS) {
        res.status(201).json(jsonGen.successValue('추가 성공'));
        return;
      } else {
        let httpErrCode = await convertHttpCode(insertResult.header.code);
        res.status(httpErrCode).json(insertResult);
        return;
      }
}
