//main server process

var http = require('http');
var path = require('path');
var express = require('express');
var fs = require('fs');
var weather = require('./weather');
var bodyParser = require('body-parser');


var router = express();
var server = http.createServer(router);
router.use(express.static(path.resolve(__dirname, 'client')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.set('views', path.join(__dirname, 'views'));
router.set('view engine', 'ejs');

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("sever started .. port"+ ": " + addr.port);
});

  router.get('/', function(req, res){
   
        res.render('tempSet');  //location setting temp page
    });
    
 router.post('/myPosition', function(req, res){
        var xPos ,yPos;
        var userDongName =req.body.userDongName;
        var data = fs.readFileSync('positionFile', 'utf8') .split('\n');
        
        for(var i in data){
           if (data[i].indexOf(userDongName) > -1) {
             xPos = data[i].toString().substring(23,30).replace(/\s/gi,'');//24th xpos   27 ypos..
             yPos = data[i].toString().substr(30).replace(/\s/gi,'');
             weather.realTimeWeather(xPos,yPos,res);
            }
        }
    });
//--------------------------------------------------------------------------------------------------------------