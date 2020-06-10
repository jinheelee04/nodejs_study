'use strict';

module.exports = {
  ERR_CODE: {
    SUCCESS: 0,
    /**
     *  내부 처리 에러 1~10 
     */
    INVALID_PARAM: 1,   //HTTP 400 : 파라미터 누락, 입력값 오류 등등
    NO_DATA: 2,         //HTTP 404 : 데이터가 없는 경우
    DB_ERR: 3,          //HTTP 500 : DB 연동 및 쿼리 관련 오류
    NO_ALTITUDE: 4,     //HTTP 404 : 고도 정보가 없는 경우
    /**
     * 연동 구간 에러 11~
     */
    AWS_ERR: 11,        //HTTP 404 : 기상청 결과값이 에러로 오는 경우
    AWS_FAIL: 12,       //HTTP 500 : 기상청 연동관련 오류
    OPENDATA_ERR: 13,   //HTTP 404 : 공공데이터 결과값이 에러로 오는 경우
    OPENDATA_FAIL: 14,  //HTTP 500 : 공공데이터 연동관련 오류
    VWORLD_ERR: 15,     //HTTP 404 : 브이월드 결과값이 에러로 오는 경우
    VWORLD_FAIL: 16,    //HTTP 500 : 브이월드 연동관련 오류
    SHUB_ERR: 17,       //HTTP 404 : SHUB 결과값이 에러로 오는 경우
    SHUB_FAIL: 18,      //HTTP 500 : SHUB 연동관련 오류
    SHUB_REG_FAIL: 19,  //HTTP 404 : 이미 등록된 단말에 대해 특수처리.
    NO_BUILDING: 20,    //HTTP 404 : 공공데이터 연동 결과, 건물정보가 없을 경우
    /**
     * 기타 알 수 없는 에러
     */
    ETC: 99
  },
  convertHttpCode: (error_code) => {
      let retVal = 500;
      switch(error_code) {
        case ERR_CODE.SUCCESS:
          retVal = 200;
          break;
        case ERR_CODE.INVALID_PARAM:
          retVal = 400;
          break;
        case ERR_CODE.NO_DATA:
        case ERR_CODE.NO_ALTITUDE:
        case ERR_CODE.AWS_ERR:
        case ERR_CODE.OPENDATA_ERR:
        case ERR_CODE.VWORLD_ERR:
        case ERR_CODE.SHUB_ERR:
        case ERR_CODE.NO_BUILDING:
          retVal = 404;
          break;
        case ERR_CODE.DB_ERR:
        case ERR_CODE.AWS_FAIL:
        case ERR_CODE.OPENDATA_FAIL:
        case ERR_CODE.VWORLD_FAIL:
        case ERR_CODE.SHUB_FAIL:
          retVal = 500;
          break;
    }
    return retVal;
  }
}