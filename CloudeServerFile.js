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

var notifications = new Array(3);
var id = new Array(100);
var userNum= 0;
var resultvalue= new Array(100);
var deviceNum = 0;

    router.get('/data', function(req, res){
        var dataType =req.param("dataType");
        var deviceIP =req.param("deviceIP");
        resultvalue[deviceNum] = new Array(8);
        resultvalue[deviceNum][0] = deviceIP;

        console.log("data"+deviceIP);
        if(dataType == "bus") //운동에 대한 데이터 전달
        {
            
            resultvalue[deviceNum][1] =req.param("busDes");
            resultvalue[deviceNum][2] =req.param("stationName");
            

            
        }
        else  if(dataType == "train") //운동에 대한 데이터 전달
        {
            
            resultvalue[deviceNum][3] =req.param("stationName");

            
        }
        else  if(dataType == "memo") //운동에 대한 데이터 전달
        {
            
            resultvalue[deviceNum][4] =req.param("exerciseNum");
            resultvalue[deviceNum][5] =req.param("exerciseName");
 
        }
        else  if(dataType == "schedule") //운동에 대한 데이터 전달
        {
            
            resultvalue[deviceNum][6] =req.param("scheduleContent");
            resultvalue[deviceNum][7] =req.param("scheduleDay");
 
        }
        
        deviceNum++;
        if(deviceNum == 99)
            deviceNum = 0;
    });
    
     router.get('/syncData', function(req, res){
        var deviceIP =req.param("deviceIP");
        var sendingData = new Array(7);
        
        for(var i=0; i<deviceNum ; i++){
            if(resultvalue[i][0] != deviceIP && resultvalue[i][0] != null){
                 console.log("syncData"+i+deviceIP);
                sendingData[0]= resultvalue[i][1];
                sendingData[1]= resultvalue[i][2];
                sendingData[2]= resultvalue[i][3];
                sendingData[3]= resultvalue[i][4];
                sendingData[4]= resultvalue[i][5];     
                 sendingData[5]= resultvalue[i][6];
                sendingData[6]= resultvalue[i][7];     
                
                resultvalue[i][0]= null;
                resultvalue[i][1]= null;
                resultvalue[i][2]= null;
                resultvalue[i][3]= null;
                resultvalue[i][4]= null;
                resultvalue[i][5]= null;
                 resultvalue[i][6]= null;
                resultvalue[i][7]= null;
                break;
            }
        }
       
        var renderingJson = JSON.stringify(sendingData);
        res.writeHead(200 , {'Content-Type': 'text/html'});
	    res.end(renderingJson);


    });
    
    
    
    
    
    
    
    
    
    

    router.get('/findNotis', function(req, res){
       var sendingData = new Array(3);
        sendingData[0]= notifications[0];
        sendingData[1]= notifications[1];
        sendingData[2]= notifications[2];
        var renderingJson = JSON.stringify(sendingData);
        res.writeHead(200 , {'Content-Type': 'text/html'});
	    res.end(renderingJson);
    });
    
    router.get('/notification', function(req, res){
        
        var id =req.param("id");
        if(id.indexOf("messaging") != -1)
            notifications[0] = id;
        else if(id.indexOf("kakaotalk") != -1)
            notifications[1] = id;
        else if(id.indexOf("facebook") != -1)
            notifications[2] = id;
            
            console.log("====new Noti");
            console.log(notifications[0]);
            console.log(notifications[1]);
            console.log(notifications[2]);
       
    });
    
     router.get('/checkNoti', function(req, res){
        
        notifications[0] = null;
        notifications[1] = null;
        notifications[2] = null;
       
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

