express = require 'express'
app = express()
http = require('http').Server(app)
# https = require('https').Server(app);
helmet = require 'helmet'

http.listen process.env.PORT, 'localhost', ->
	console.log "listening on * : " + process.env.PORT

app.use helmet()

app.get '/', (req, res) ->
	res.sendFile 'dist/index.html', { root: '.' }

app.get '/rr', (req, res) ->
  res.redirect 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

app.use express.static 'dist'
