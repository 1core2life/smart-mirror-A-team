exports.imageSearch = function(res,temperForCodi) {
    var urlencode = require('urlencode');
    var request = require('request');
    var cheerio = require('cheerio')
    var iconv = require('iconv-lite');

    temperForCodi = returnWeather(temperForCodi);

    var EncodedName = urlencode(temperForCodi);

    request({
    url: "https://www.google.co.kr/search?rlz=1C1NHXL_koKR727KR727&biw=2048&bih=1012&tbm=isch&sa=1&q="+EncodedName
         +"&oq=%EA%B2%A8%EC%9A%B8+%EC%BD%94%EB%94%94&gs_l=psy-ab.3..0i24k1.7934.8641.0.8722.7.7.0.0.0.0.147.620.0j5.5.0....0...1.1j4.64.psy-ab..5.1.146.yj9uEb-nkGc",
    method: 'GET'
    },function(err,req,body){
       // iconv.extendNodeEncodings();
        var strContents = new Buffer(body);
        var $ = cheerio.load(iconv.decode(strContents, 'EUC-KR').toString());

        var imgs =[];
        var count= 0;
 
        $("img").each(function(item,index,array){
            count++;
            
            imgs.push($(this).attr("src"));
            if(count == 6)
              return false;
        })
 
        res.json({ect:imgs});
    });
}
 
function returnWeather(temperForCodi){
    if(temperForCodi >= 27)
        return "더운 여름 코디"
    else if(temperForCodi >= 20)
        return "여름 코디"
    else if(temperForCodi >= 17)
        return "더운 봄 코디"
    else if(temperForCodi >= 12)
        return "초가을 코디"
    else if(temperForCodi >= 10)
        return "가을 코디"
    else if(temperForCodi >= 6)
         return "초겨울 코디"
    else
        return "겨울 코디"
}