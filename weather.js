exports.realTimeWeather = function(xPos,yPos,res) {
    
    
    if(xPos == 0 && yPos == 0){
        res.render('index', {
        temp: 0,
        rainPro: 0,
        rainForm: 0,
        wetPercent: 0,
        minTemp: 0,
        weatherImg : "rainsun.png",
        userStyle: "장소를 지정해주세요"
      });
      
      return ;
    }
    
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
    
    if(hours >= 10 ) {
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
  
      var weatherImg;
      
      if(skyForm == 0)
        {
            weatherImg = 'sun.png';
            if(rainForm == 1)
                weatherImg = 'rainsun.png';
      }
      else if(skyForm == 1)
        {
            weatherImg = 'alittlecloud.png';
            if(rainForm != 0)
                weatherImg = checkRain(rainForm);
      }
      else if(skyForm == 2)
        {
            weatherImg = 'lotsofcloud.png';
            if(rainForm != 0)
                weatherImg = checkRain(rainForm);
      }
      else
        {
            weatherImg = 'heurim.png';
            if(rainForm != 0)
                weatherImg = checkRain(rainForm);
      }    
    
      var userStyle;
      switch(checkStyle(temperature)){
          case 0:
              userStyle = "오늘 날씨는 매우 더운 여름 날씨입니다.짧은 반바지나 민소매 등 얇게 입는 것을 권합니다."; 
              break;
          case 1:
              userStyle = "오늘 날씨는 저녁의 여름 날씨입니다.적당한 반팔이나 얇은 긴팔 등을 입는 것을 권합니다."; 
              break;
          case 2:
              userStyle = "오늘 날씨는 적당한 여름 날씨입니다.긴팔티 혹은 면바지 등을 입는 것을 권합니다."; 
              break;
          case 3:
              userStyle = "오늘 날씨는 더운 봄 날씨입니다.슬슬 두꺼운 옷을 입는 것도 괜찮습니다."; 
              break;
          case 4:
              userStyle = "오늘 날씨는 쌀쌀한 수준입니다.얇은 외투를 입어 따뜻한 온도를 유지하기를 권합니다."; 
              break;
          case 5:
              userStyle = "오늘 날씨는 추운 가을 날씨입니다.트렌치 코트, 따뜻한 니트 등을 입는 것을 권합니다."; 
              break;
          case 6:
              userStyle = "오늘 날씨는 초겨울 날씨입니다.코트, 가죽 자켓 등으로 추위를 이겨내시길 권합니다."; 
              break;
          case 7:
              userStyle = "오늘 날씨는 추운 겨울 날씨입니다.목도리, 패딩 등을 입는 것을 권합니다."; 
              break;
      }
        
      res.render('index', {
        temp: temperature,
        rainPro: rainProbability,
        rainForm: rainForm,
        wetPercent: wetPercent,
        minTemp: minTemp,
        weatherImg : weatherImg,
        userStyle: userStyle
      });
    });
   
}

function checkRain(rainForm){
    if(rainForm == 1)
      return 'rain.png';
    else if(rainForm == 2)
      return 'rainsnow.png';
    else if(rainForm == 3)
      return 'snow.png';
}

function checkStyle(temperature){
    
    if(temperature >= 27)
        return 0
    else if(temperature >= 23)
        return 1
    else if(temperature >= 20)
        return 2
    else if(temperature >= 17)
        return 3
    else if(temperature >= 12)
        return 4
    else if(temperature >= 10)
        return 5
    else if(temperature >= 6)
        return 6
    else
        return 7
}