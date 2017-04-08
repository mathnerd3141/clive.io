express = require 'express'
app = express()
http = require('http').Server(app)
# https = require('https').Server(app);
helmet = require 'helmet'
request = require 'request'

http.listen process.env.PORT, 'localhost', ->
	console.log "listening on * : " + process.env.PORT

app.set 'trust proxy', true

app.use helmet()

app.get '/', (req, res) ->
	res.sendFile 'dist/index.html', { root: '.' }

app.get '/rr', (req, res) ->
  res.redirect 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

app.use '/resume.pdf', (req, res, next) ->
  request.get 'http://ip-api.com/json/' + req.ip, (api_err, api_res, api_data) ->
    if (api_err) console.log 'Resume ' + req.ip + ', lookup error.'
    else if (api_res.statusCode != 200) console.log 'Resume ' + req.ip + ', lookup returned status ' + api_res.statusCode + '.'
    else console.log 'Resume ' + req.ip + ', lookup: ' + data.html_url.org + ' isp ' + data.html_url.isp + ' in ' + data.html_url.city + ',' + data.html_url.regionName + ',' + data.html_url.countryCode
    next()

app.use express.static 'dist'
