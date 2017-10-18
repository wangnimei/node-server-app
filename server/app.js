var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var fs = require('fs')
var jsonContent = JSON.stringify({
  path: '/Users/terry/Documents/views'
})

// set server folder in the config file of the app
if (fs.existsSync(`${process.cwd()}/tmp`)) {
  if (!fs.existsSync(`${process.cwd()}/tmp/node_server_app.config.json`)) {
    fs.writeFileSync(`${process.cwd()}/tmp/node_server_app.config.json`, jsonContent, 'utf8')
  }
} else {
  fs.mkdirSync(`${process.cwd()}/tmp`)
  fs.writeFileSync(`${process.cwd()}/tmp/node_server_app.config.json`, jsonContent, 'utf8')
}

var folderPath = JSON.parse(fs.readFileSync(`${process.cwd()}/tmp/node_server_app.config.json`)).path

var index = require('./routes/index')

var app = express()

// view engine setup
app.engine('html', require('ejs').renderFile)
app.set('views', folderPath)
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(folderPath))

app.use('/', index)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app
