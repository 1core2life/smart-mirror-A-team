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
    var cheerio = require('cheerio');
    var iconv = require('iconv-lite');
    var urlencode = require('urlencode');
    var EncodedName = urlencode(stationName);

    var SearchStationNum = "http://swopenAPI.seoul.go.kr/api/subway/546876586477686938334655746c76/json/realtimeStationArrival/0/5/"+EncodedName;
    request({
    url: SearchStationNum,
    method: 'GET'
    }, function(err, response, body) {
        var totalInfo = JSON.parse(body);

        var array2 = {"toStation": [], "predictTime": []};
        
        for( var i in totalInfo["realtimeArrivalList"]){

                array2["toStation"][i] = totalInfo["realtimeArrivalList"][i]["trainLineNm"];
                array2["predictTime"][i] = totalInfo["realtimeArrivalList"][i]["arvlMsg2"];
            }

        var renderingJson = JSON.stringify(array2);
        res.writeHead(200 , {'Content-Type': 'text/html'});
	    res.end(renderingJson);

           
    });
}