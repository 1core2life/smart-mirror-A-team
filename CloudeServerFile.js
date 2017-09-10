//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
//var http = require('http');
//var path = require('path');
//var bodyParser = require('body-parser');

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
//router.use(CORS);
//router.use(express.static(path.resolve(__dirname, 'client')));
//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: true }));


//server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
 // var addr = server.address();
  //console.log("Chat server listening at", addr.address + ":" + addr.port);
//});

var id = new Array(100);
var userNum= 0;
var resultvalue= new Array();

  // router.get('/channel', function(req, res){
      //  var channel_id =req.param("channel_id");
    //    var userName =req.param("userName");
      //  userNum++;
     //  console.log("channel_id: "+ channel_id +"userName:"+userName );
     //  newUser(userName,channel_id);
//    });
    
//    router.get('/findUser', function(req, res){
  //      var userName =req.param("userName");
        
    //   for( var i in id){
      //  if(id[i][0] == userName){
        //    console.log("userName found!" );
          //  resultvalue= id[i][1];
          
    //    }
//      }
  //      var renderingJson = JSON.stringify(resultvalue);
    //        res.writeHead(200 , {'Content-Type': 'text/html'});
	  //        res.end(renderingJson);
    //});
//function newUser(userName,channel_id){
 // id[userNum-1] = new Array(2);
  //id[userNum-1][0] = userName;
 // id[userNum-1][1] = channel_id;
//}

