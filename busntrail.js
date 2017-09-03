exports.searchBus = function(res,stationName,busDes) {
    
    var request = require('request');

    var urlencode = require('urlencode');
    var EncodedName = urlencode(stationName);
    
    var SearchStationNum = "http://m.gbis.go.kr/search/getStationPageList.do?tabMode=&serviceKey=1234567890&pageSize=15&pageNo=1&keyword="+EncodedName+"&routeType=41%2C42%2C43%2C51%2C52%2C53&searchData="+EncodedName+"&osInfoType=M";

    request({
    url: SearchStationNum,
    method: 'GET'
    }, function(err, response, body) {
        var totalInfo = JSON.parse(body);
        var array = {"station": [], "stationId": []};
        
        for( var i in totalInfo["result"]["stationList"]){
            array["station"][i] = totalInfo["result"]["stationList"][i]["stationName"];
            array["stationId"][i] = totalInfo["result"]["stationList"][i]["stationId"];
        }
      // here, 0~ n th check from user , then input num
      // untill input system made, use 0 input
      SearchStationNum = "http://m.gbis.go.kr/search/getBusStationArrival.do?stationId="+array["stationId"][busDes]+"&osInfoType=M";
        request({
        url: SearchStationNum,
        method: 'GET'
        }, function(err, response, body) {
            var totalInfo2 = JSON.parse(body);
            var array2 = {"busNum": [], "predictTime": [], "routeDestName": []};
        
            for( var i in totalInfo2["busStationArrivalInfo"]["arrivalList"]){
                array2["routeDestName"][i] = totalInfo2["busStationArrivalInfo"]["arrivalList"][i]["routeDestName"];
                array2["busNum"][i] = totalInfo2["busStationArrivalInfo"]["arrivalList"][i]["routeName"];
                array2["predictTime"][i] = totalInfo2["busStationArrivalInfo"]["arrivalList"][i]["predictTime1"];
            }

            var renderingJson = JSON.stringify(array2);
            res.writeHead(200 , {'Content-Type': 'text/html'});
	        res.end(renderingJson);

        });
    });
}

exports.searchTrain = function(res,stationName) {
    
    var request = require('request');

    var urlencode = require('urlencode');
    var EncodedName = urlencode(stationName);

    var SearchStationNum = "https://m.seoul.go.kr/mobile/traffic/subway/GetSubwayRealtimeStationArrival.do";
    request({
    url: SearchStationNum,
    data :{
        		statnNm : EncodedName,
        		timeStamp : "1504283576",
        		ckSessionKey : "S20170902011011339_1504282211339_59.11.143.158"
    },
    method: 'POST'
    }, function(err, response, body) {
         var totalInfo2 = JSON.parse(body);
          console.log(totalInfo2);
            var array2 = {"STATN_NM": [], "predictTime": [], "routeDestName": []};  //post로 데이터 넘겨줘야 하는데 되는거지 안되는거지 모르겟다
        
            for( var i in totalInfo2["subwayStationMap"]){
                array2["STATN_NM"][i] = totalInfo2["subwayStationMap"]["STATN_NM"];
               console.log(array2["STATN_NM"][i]);
            }

           
    });
}