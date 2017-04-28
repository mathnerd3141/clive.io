express = require 'express'
app = express()
http = require('http').Server(app)
# https = require('https').Server(app);
helmet = require 'helmet'
request = require 'request'
path = require 'path'

http.listen process.env.PORT, 'localhost', ->
	console.log "listening on * : " + process.env.PORT

app.set 'trust proxy', true

app.use helmet()

app.get '/', (req, res) ->
	res.sendFile 'index.html', { root: path.join __dirname, '../dist' }

app.get '/rr', (req, res) ->
  res.redirect 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

app.get ['/resume', '/resume.pdf'], (req, res) ->
  res.setHeader 'Cache-Control', 'no-cache, must-revalidate'
  res.sendFile 'resume.pdf', { root: path.join __dirname, '../dist' }
  request.get 'http://ip-api.com/json/' + req.ip, (api_err, api_res, api_data) ->
    try
      api_data = JSON.parse api_data
    catch json_err
      return console.error json_err
    if api_err or api_res.statusCode != 200 then console.log 'Resume ' + req.ip + ', lookup error.'
    else if api_data?.status != 'success' then console.log 'Resume ' + req.ip + ', lookup error: ' + api_data?.message + '.'
    else console.log 'Resume ' + req.ip + ',' + 
      ' ISP ' + api_data?.isp +
      (if api_data?.org != api_data?.isp then ' ORG ' + api_data?.org else '') +
      ' FROM ' + api_data?.city + ', ' + api_data?.regionName + ', ' + api_data?.countryCode + '.'

app.use express.static 'dist'
