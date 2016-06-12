express = require('express');
app = express();
http = require('http').Server(app);
https = require('https').Server(app);

PORT = process.argv[2] || 2121;

http.listen PORT, ->
	console.log "listening on * : " + PORT

app.get '/', (req, res) ->
	res.sendFile 'static/index.html', { root: __dirname }

app.use express.static 'static'
