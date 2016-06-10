var express = require('express');
var app = express();
var http = require('http').Server(app);
var https = require('https').Server(app);

var PORT = 2121;

http.listen(PORT, function(){
	console.log("listening on * : " + PORT);
});

app.get('/', function(req,res){
	console.log('hi user!');
	res.sendFile('client/index.html', { root: __dirname });
}

app.use(express.static('client'));

