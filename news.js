exports.news_result = function(res) {
    
var request = require("request");
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var dt = new Date();
var month = dt.getMonth()+1;
if(month<10)
	{
		month="0"+month;
	}
var day = dt.getDate();
if(day<10)
	{
		day="0"+day;
	}
var year = dt.getFullYear();


    request({
    url: 'http://news.naver.com/main/ranking/popularDay.nhn?rankingType=popular_day&sectionId=000&date='+year+month+day,
    method: 'GET',
	encoding: null
    }, function(err, response, body) {
		var title=new Array();
		var writer=new Array();
		var date=new Array();
   iconv.extendNodeEncodings();
   var strContents = new Buffer(body);
   $ = cheerio.load(iconv.decode(strContents, 'EUC-KR').toString());
   //console.log($('.list_body.newsflash_body').html());	// 기사 목록을 출력
   result = [];
   $('.ranking_top3.ranking_top3_v2').find('li').each(function(index, ele) {
      var dt1 = $(this).eq(0);
 	   title.push(dt1.find('a').text());
       var dd = $(this).find('dd').eq(0);
       var temp=dd.find('span').text().trim();
       temp=temp.split('|');
	   writer.push(temp[0]);
	   date.push(temp[1]);
   });
   $('.ranking_section.ranfir2').find('li').each(function(index, ele) {
      var dt1 = $(this).eq(0);
 	   title.push(dt1.find('a').text());
       var dd = $(this).find('span').eq(0).text().trim();
       writer.push(dd);
	   
   }); 	
		
		console.log(title);
		console.log(writer);
		res.render('new_result', {
    	news: title,
		writer: writer
    });
});
};

