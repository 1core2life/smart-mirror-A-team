var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('fs');
var weather = require('./weather');
var bodyParser = require('body-parser');
var busntrail = require('./busntrail');
var music=require('./music');
var news=require('./news');
var imageSearch=require('./imageSearch');
var ejs=require('ejs');
var mysql=require('mysql');
var client_id = 'RLZaE7QUw3TxOxJNWNIY';
var client_secret = 'bbmotnwyW_';
var client =mysql.createConnection({
	user:'root',
	password: '123',
	database: 'schedule'
});
var router = express();

var server = http.createServer(router);
router.use(express.static(path.resolve(__dirname, 'client')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
router.set('views', path.join(__dirname, 'views'));
router.set('view engine', 'ejs');


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("sever started .. port"+ ": " + addr.port);
});
  
  router.get('/voicecall', function(req, res){
   
        res.render('rtccall');  //location setting temp page
    });
    
    
  router.get('/', function(req, res){
   
        weather.realTimeWeather(0,0,res);
    });
    
  router.post('/faceYoutube', function(req, res){
        var musicName = req.body.musicname;
	    music.searchMusic(res,musicName+"호 화장법");  
	 		 console.log(musicName+"호 화장법");

  });   
    
  router.post('/capture', function(req, res) {
        var data = req.body.photo.replace(/^data:image\/\w+;base64,/, "");
   var buf = new Buffer(data, 'base64');
   fs.writeFile('./client/img/myCaptureImg.png', buf);
   
  })
    
  router.post('/face', function (req, res) {
 
   var request = require('request');
   var api_url = 'https://openapi.naver.com/v1/vision/face'; // 얼굴 감지
    
   var _formData = {
     image:'image',
     image: fs.createReadStream(__dirname+'/client/img/myCaptureImg.png') // FILE 이름
   };
    var _req = request.post({url:api_url, formData:_formData,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}}).on('response', function(response) {
       console.log(response.statusCode) // 200
       console.log(response.headers['content-type'])
    });
    _req.pipe(res); // 브라우저로 출력
  });    
    
  router.post('/imageSearch',function(req,res){
    var temperForCodi = req.body.temperForCodi;
    imageSearch.imageSearch(res,temperForCodi);
 
  });
    
  router.post('/searchStationNum', function(req, res){
        var stationName = req.body.stationName;
        var busDes = req.body.busDes;
        busntrail.searchBus(res,stationName,busDes);  //location setting temp page
    });  
    
   router.post('/searchTrainStationNum', function(req, res){
        var stationName = req.body.stationName;
        busntrail.searchTrain(res,stationName);  //location setting temp page
    });    
    
  router.get('/myPosition', function(req, res){
        var xPos ,yPos;
        var userDongName =req.param("userDongName");
        
        if(userDongName){
        var data = fs.readFileSync('positionFile', 'utf8') .split('\n');

            for(var i in data){
               if (data[i].indexOf(userDongName) > -1) {
                 xPos = data[i].toString().substring(23,30).replace(/\s/gi,'');//24th xpos   27 ypos..
                 yPos = data[i].toString().substr(30).replace(/\s/gi,'');
                 weather.realTimeWeather(xPos,yPos,res);
                }
            }
        }
        else{
            weather.realTimeWeather(0,0,res);
        }
    });
 router.post('/music', function(req, res){
        var musicName = req.body.musicname;
	 console.log(musicName);
	    music.searchMusic(res,musicName);  
	 	
    });  
 router.post('/news', function(req, res){
	       news.news_result(res);
    });  
 router.get('/plan',function(req,res){
	 fs.readFile('./views/list.html','utf8',function(error,data){
		 client.query('SELECT * FROM plan',function(error, results){
			 res.send(ejs.render(data, {
				 data: results
			 }));
		 });
	 });
 });
 router.get('/plan/delete/:date',function(req,res){ 
	 client.query('DELETE FROM plan WHERE date=?', [req.params.date], function () {
     res.redirect('/plan');
 	 });
 });
 router.get('/plan/insert',function(req,res){ 
   	fs.readFile('./views/insert_list.html', 'utf8', function (error, data) {
    res.send(data);
 	 });
 });
 router.post('/plan/insert',function(req,res){
	var body = req.body;
  		client.query('INSERT INTO plan (date, schedule) VALUES (?, ?)', [
     	body.date, body.schedule], function () {
        res.redirect('/plan');
 	 });
 });
 router.get('/plan/edit/:date',function(req,res){
	fs.readFile('./views/edit_list.html', 'utf8', function (error, data) {
    
    client.query('SELECT * FROM plan WHERE date = ?', [
        req.params.date
    ], function (error, result) {
      
      res.send(ejs.render(data, {
        data: result[0]
      }));
    });
  });
 });
 router.post('/plan/edit/:date',function(req,res){
	var body = req.body; 
  	client.query('UPDATE plan SET schedule=? WHERE date=?', [body.schedule, req.params.date], function () {
  	res.redirect('/plan');
  });
 });