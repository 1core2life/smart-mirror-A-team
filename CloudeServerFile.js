//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var CORS = require('cors')();
router.use(CORS);
router.use(express.static(path.resolve(__dirname, 'client')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

var notifications = new Array(100);
var id = new Array(100);
var userNum= 0;
var resultvalue= new Array();

    router.get('/findNotis', function(req, res){
       var deviceIp =req.param("myIp");
       var sendingData = new Array(6);
       for( var i in notifications){
        if(notifications[i][6] == deviceIp){
            console.log("deviceIp found!" );
            sendingData[0]= notifications[i][0];
            sendingData[1]= notifications[i][1];
            sendingData[2]= notifications[i][2];
            sendingData[3]= notifications[i][3];
            sendingData[4]= notifications[i][4];
            sendingData[5]= notifications[i][5];
            }
        }
        var renderingJson = JSON.stringify(sendingData);
        res.writeHead(200 , {'Content-Type': 'text/html'});
	    res.end(renderingJson);
    });
    
    router.get('/notification', function(req, res){
        var kakaoContent =req.param("kakaoContent");
        var kakao =req.param("kakao")
        var instaContent =req.param("instaContent");
        var insta =req.param("insta");
        var faceContent =req.param("faceContent");
        var face =req.param("face");
        var deviceIp =req.param("myIp");

        for(var i = 0; i<notifications.length ; i++)
        {

            if(notifications[i] ==  deviceIp)
            {
                notifications[i] = new Array(7);
                notifications[i][0] =kakaoContent;
                notifications[i][1] =kakao;
                notifications[i][2] =instaContent;
                notifications[i][3] =insta;
                notifications[i][4] =faceContent;
                notifications[i][5] =face;
                notifications[i][6] =deviceIp;
                break;
            }
            if(!notifications[i])
            {
                notifications[i] = new Array(7);
                notifications[i][0] =kakaoContent;
                notifications[i][1] =kakao;
                notifications[i][2] =instaContent;
                notifications[i][3] =insta;
                notifications[i][4] =faceContent;
                notifications[i][5] =face; 
                notifications[i][6] =deviceIp;
                break;
            }
        }
        
    });

   router.get('/channel', function(req, res){
        var channel_id =req.param("channel_id");
        var userName =req.param("userName");
        userNum++;
       console.log("channel_id: "+ channel_id +"userName:"+userName );
       newUser(userName,channel_id);
    });
    
    router.get('/findUser', function(req, res){
        var userName =req.param("userName");
        
       for( var i in id){
        if(id[i][0] == userName){
            console.log("userName found!" );
            resultvalue= id[i][1];
          
        }
      }
        var renderingJson = JSON.stringify(resultvalue);
        res.writeHead(200 , {'Content-Type': 'text/html'});
	    res.end(renderingJson);
    });

    
    function newUser(userName,channel_id){
      id[userNum-1] = new Array(2);
      id[userNum-1][0] = userName;
      id[userNum-1][1] = channel_id;
    }

