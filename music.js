exports.searchMusic = function(res,musicName) {
    
    var request = require('request');
  	 var Youtube = require('youtube-node');
	 var urlencode = require('urlencode');
	var EncodedName = urlencode(musicName);
	var youtube = new Youtube();
	
	var tmp=musicName;
	youtube.setKey('AIzaSyCNGcipNkncK2BlwCNXDg3_mS3ZON1qOOI');



    request({
    url: 'https://www.youtube.com/iframe_api',
    method: 'GET'
    }, function(err, response, body) {
        
	var youtubeURL=new Array();
	var youtubeTitle=new Array();
	var keyword = tmp;
	var limit = 1;

	youtube.addParam('order', 'relevance');
	youtube.addParam('type', 'video');
	youtube.search(keyword, limit, function(err, result) {
	  if (err) { console.log(err); return; }


 	 var items = result["items"];
  	for (var i in items) {
   		 var it = items[i];
    	 var title = it["snippet"]["title"];
 	   var video_id = it["id"]["videoId"];
		
	 var url = "https://www.youtube.com/embed/" + video_id+"?enablejsapi=1";
   	 youtubeURL.push(url);
   	 youtubeTitle.push(title);
   
    }
	res.render('music', {
    youtubeURL: youtubeURL
    });
    });
});
};