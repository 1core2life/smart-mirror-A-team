exports.realTimeWeather = function(xPos,yPos,res) {
    
    var request = require('request');


    var today = new Date;
    var week = new Array('일','월','화','수','목','금','토');
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
 
  //  $('.weather-date').html(month +"월 " + day + "일 " + week[today.getDay()]+"요일");
 
   
    if(minutes < 30){
        hours = hours - 1;
        if(hours < 0){
            // before 24, calcul yesterday
            today.setDate(today.getDate() - 1);
            day = today.getDate();
            month = today.getMonth()+1;
            year = today.getFullYear();
            hours = 23;
        }
    }
    
    // 9 -> 09
    
    if(hours > 10 ) {
        hours = '08';
    }
    else if(hours < 10) {
        hours = '02';
    } 
    if(month < 10) {
        month = '0' + month;
    }    
    if(day < 10) {
        day = '0' + day;
    } 
 
    today = year+""+month+""+day;

    var _nx = xPos, _ny = yPos;
    var key = "guYNlF9epCHjtMFaYr6MHF62QfYwiOIsONu83X1aPXXYpvTikpJyE6QRVHowtl9Vn3CQi0Qp4G9iNXPwgB%2FgJA%3D%3D",    
    ForecastGribURL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData";
    ForecastGribURL += "?ServiceKey=" + key;
    ForecastGribURL += "&base_date=" + today;
    ForecastGribURL += "&base_time=" + hours +"00";
    ForecastGribURL += "&nx=" + _nx + "&ny=" + _ny;
    ForecastGribURL += "&pageNo=1&pageSize=10&numOfRows=9&startPage=1";
    ForecastGribURL += "&_type=json";

    var rainProbability;
    var rainForm;
    var wetPercent;
    var skyForm;
    var temperature;
    var minTemp; 
    
    request({
    url: ForecastGribURL,
    method: 'GET'
    }, function (error, response, body) {
     var totalInfo = JSON.parse(body);
      rainProbability = totalInfo["response"]["body"]["items"]["item"][0]["fcstValue"];  //probability of rain
      rainForm = totalInfo["response"]["body"]["items"]["item"][1]["fcstValue"]; // no[0] , rain[1], rain/snow[2], snow [3]
      wetPercent = totalInfo["response"]["body"]["items"]["item"][3]["fcstValue"];  //wet percentage
      skyForm = totalInfo["response"]["body"]["items"]["item"][5]["fcstValue"]; //sun[1],a little cloud[2],lots of cloud[3], heurim[4]
      temperature = totalInfo["response"]["body"]["items"]["item"][6]["fcstValue"]; //temper
      minTemp = totalInfo["response"]["body"]["items"]["item"][7]["fcstValue"];
  
      console.log("강수확률"+rainProbability+"강수형태"+rainForm+
      "습도"+wetPercent+"기후"+skyForm+"온도"+temperature+"최저온도"+minTemp);
    
      var weatherImg;
      var tempStyle;    //cloth style 
      
      if(skyForm == 0)
        weatherImg = 'sun.png';
      else if(skyForm == 1)
        weatherImg = 'alittlecloud.png';
      else if(skyForm == 2)
        weatherImg = 'lotsofclound.png';
      else
        weatherImg = 'heurim.png';
        
      //tempStyle = checkStyle(temperature);
        
      res.render('index', {
        temp: temperature,
        rainPro: rainProbability,
        rainForm: rainForm,
        wetPercent: wetPercent,
        minTemp: minTemp,
        weatherImg : weatherImg
      });
    });
   
}

