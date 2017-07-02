express = require 'express'
app = express()
http = require('http').Server(app)
# https = require('https').Server(app);
helmet = require 'helmet'
request = require 'request'
path = require 'path'

if not process.env.PORT?
  console.log 'Clive.IO server: You need to specify a $PORT.'
  process.exit(1)

http.listen process.env.PORT, 'localhost', ->
	console.log 'listening on * : ' + process.env.PORT

app.set 'trust proxy', true

app.use helmet()

app.get '/', (req, res) ->
	res.sendFile 'index.html', { root: path.join __dirname, '../dist' }

app.get '/rr', (req, res) ->
  res.redirect 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  # Use redis redirect here?

cache = {}
app.get ['/resume', '/resume.pdf'], (req, res) ->
  # res.setHeader 'Cache-Control', 'no-cache, must-revalidate'
  res.sendFile 'resume.pdf', { root: path.join __dirname, '../dist' }
  
  if not cache[req.ip]
    # If not cached, we have to fetch the text for the thing to display, using our API
    cache[req.ip] = {n: 0, text: "", timeout: -1}
    request.get 'http://ip-api.com/json/' + req.ip, (api_err, api_res, api_data) ->
      try
        api_data = JSON.parse api_data
      catch json_err
        return console.error json_err
      if api_err or api_res.statusCode != 200 then cache[req.ip].text = req.ip + ', lookup error.'
      else if api_data?.status != 'success' then cache[req.ip].text = req.ip + ', lookup error: ' + api_data?.message + '.'
      else cache[req.ip].text = req.ip + ',' +
        ' ISP ' + api_data?.isp +
        (if api_data?.org != api_data?.isp then ' ORG ' + api_data?.org else '') +
        ' FROM ' + api_data?.city + ', ' + api_data?.regionName + ', ' + api_data?.countryCode + '.'
  
  # We already have it, just display it after a delay of 10 seconds to wait for any multi requests
  cache[req.ip].n++
  clearTimeout cache[req.ip].timeout
  cache[req.ip].timeout = setTimeout () ->
    console.log "R*" + cache[req.ip].n + " " + cache[req.ip].text
    cache[req.ip].n = 0
  , 10000

app.use express.static 'dist'
