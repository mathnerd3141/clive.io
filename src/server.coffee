if process.argv.length < 3
  console.log "[clive.io] Fatal error: server port argument required"
  process.exit(1)

PORT = process.argv[2]

express = require 'express'
app = express()
http = require('http').Server(app)
# https = require('https').Server(app);
helmet = require 'helmet'

http.listen PORT, 'localhost', ->
	console.log "listening on * : " + PORT

app.use helmet()

app.get '/', (req, res) ->
	res.sendFile 'dist/index.html', { root: '.' }

app.use express.static 'dist'
