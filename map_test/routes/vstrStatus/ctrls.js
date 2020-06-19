'use strict';
const zoneModel = require('../../models/scrtZone');
var isEmpty = require('is-empty');
const jsonGen = require( '../../common/jsonGenerator');
const locationModel = require('../../models/location');

exports.vstrStatus= async (req,res) =>{

  let result = await locationModel.getAll();
  let zoneResult = await zoneModel.getAll();

  if( zoneResult .header.code ==ERR_CODE.NO_DATA){
      zoneResult.data = null;
  }

  if(result.header.code == ERR_CODE.SUCCESS) {
    for( var data of result.data ){
        switch (data.status_code){
            case "VSCD002" :
                data.status_name="1층 출입";
                break;
            case "VSCD003" :
                data.status_name="정상출입";
                break;
            case "VSCD004" :
                data.status_name="보안구역부근";
                  break;
            case "VSCD005" :
                data.status_name="보안구역진입";
                break;
            default :
            data.status_name="정보 없음";
          }      
    }


    res.status(200).render('status/vstrStatus', { title: '출입자 보안 관제 ', results : result.data, zoneResults : zoneResult.data});

  } else if(result.header.code ==ERR_CODE.NO_DATA){
    res.status(200).render('status/vstrStatus', { title: '출입자 보안 관제 ', results : null, zoneResults : zoneResult.data});

  }else {
    let httpErrCode = await convertHttpCode(result.header.code);
    res.status(httpErrCode).json(result);
    return;
  }

}