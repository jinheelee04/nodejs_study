'use strict';

function successValue(data) {
    var jsonData = {};
    var header = {code: ERR_CODE.SUCCESS, msg: 'success'};
    jsonData.header = header;
    jsonData.data = data;

    return jsonData;
}

/*
http header와 동일한 에러코드 생성해서 전달
100 : Continue(계속) 
101 : Switching protocols (통신규약 전환) 
200 : OK, 에러없이 전송 성공 
201 : Created, POST 명령 실행 및 성공 
202 : Accepted, 서버가 클라이언트 명령을 받음 
203 : Non-authoritative information, 서버가 클라이언트 요구중 일부만 전송 
204 : No content, 클라언트 요구을 처리했으나 전송할 데이터가 없음 
205 : Reset content (내용 원위치) 
206 : Partial content (부분내용) 
300 : Multiple choices, 최근에 옮겨진 데이터를 요청 
301 : Moved permanently, 요구한 데이터를 변경된 임시 URL에서 찾았음 
302 : Moved temporarily, 요구한 데이터가 변경된 URL에 있음을 명시 
303 : See other, 요구한 데이터를 변경하지 않았기 때문에 문제가 있음 
304 : Not modified (수정안됨) 
305 : Use proxy (프록시 사용) 
400 : Bad request, 클라이언트의 잘못된 요청으로 처리할 수 없음 
401 : Unauthorized, 클라이언트의 인증 실패 
402 : Payment required, 예약됨 
403 : Forbidden, 접근이 거부된 문서를 요청함 
404 : Not found, 문서를 찾을 수 없음 (특히 이게 많죠.) 
405 : Method not allowed, 리소스를 허용안함 
406 : Not acceptable, 허용할 수 없음 
407 : Proxy authentication required, 프록시 인증 필요 
408 : Request timeout, 요청시간이 지남 
409 : Conflict (충돌) 
410 : Gone, 영구적으로 사용할 수 없음 
411 : Length required (필요조건 너무 김) 
412 : Precondition failed, 전체조건 실패 
413 : Request entity too large, (본건 요구사항 너무 큼) 
414 : Request-URI too long, URL이 너무 김 
415 : Unsupported media type (인증 안된 미디어 유형) 
500 : Internal server error, 내부서버 오류(잘못된 스크립트 실행시) 
501 : Not implemented, 클라이언트에서 서버가 수행할 수 없는 행동을 요구함 
502 : Bad gateway, 서버의 과부하 상태 
503 : Service unavailable, 외부 서비스가 죽었거나 현재 멈춤 상태 
504 : Gateway timeout (접속장치 설정시간지남 
505 : HTTP version not supported (http 버전 지원않됨)
*/
function failValue(code, msg) {
    var jsonData = {};
    var header = {code: code, msg: msg};
    jsonData.header = header;
    jsonData.data = {};

    return jsonData;
}

function failValueWithData(code, msg, data) {
    var jsonData = {};
    var header = {code: code, msg: msg};
    jsonData.header = header;
    jsonData.data = data;

    return jsonData;
}

module.exports = {
    successValue: successValue,
    failValue: failValue,
    failValueWithData: failValueWithData
}