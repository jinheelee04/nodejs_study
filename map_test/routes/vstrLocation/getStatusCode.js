'use strict';
var isEmpty = require('is-empty');

/**
 * 사용자의 위치 상태 정보 계산
 *
 */
async function getStatus(scrtZoneInfo, userLong, userLat) {

    let status;
    console.log("userLong="+userLong);
    console.log("userLat="+userLat);


    for( let z of scrtZoneInfo){
        console.log(z.zone_name);
        var dist1 = await getDist(z.c1_long, z.c1_lat, userLong, userLat);
        var dist2 = await getDist(z.c2_long, z.c2_lat, userLong, userLat);
        
        console.log("dist1="+dist1);    
        console.log("dist2="+dist2);

        //보안구역 진입일 경우 
        if(dist1 < z.c1_r1 || dist2 < z.c2_r1 ) {
            status = "VSCD005";
        } //보안구역 부근일 경우
        else if( (dist1< z.c1_r2 || dist2 < z.c2_r2) && (dist1 >= z.c1_r1 && dist2>=z.c2_r1) ){
            status="VSCD004";
        }else{
            status="VSCD003"
        }
     
    }

    console.log("status="+status);
    return status;
}

/**
 *  2개의 경위도간 거리구함 
 */

function getDist(lng1, lat1, lng2, lat2){
   

    var R = 6378137; // Earth’s mean radius in meter
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;  
    return d; // returns the distance in meter

 

}


 function deg2rad (deg) {
    
    return (deg * Math.PI / 180.0);
};

 function rad2deg (rad) {
        
    return (rad * 180 / Math.PI);
};


module.exports = {
    getStatus: getStatus
}