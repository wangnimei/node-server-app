var electron = require('electron')
var settings = require('electron-settings')
// Module to control application life.
var app = electron.app
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow
var ipcMain = electron.ipcMain

var path = require('path')
var url = require('url')

var serverSettings = require('./server/app')
var debug = require('debug')('server:server')
var http = require('http')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow
var server
var sockets = []

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 450,
    resizable: false,
    fullscreen: false,
    fullscreenable: false
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // BrowserWindow.addDevToolsExtension('/Users/terry/Documents/vueDevTool')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  closeServer()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  mainWindow.webContents.send('listening', bind)
}

// close server
function closeServer() {
  sockets.forEach(function (socket) {
    socket.destroy()
  })
  server.close(function() {
    if (mainWindow) mainWindow.webContents.send('closed')
  })
}

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000')
serverSettings.set('port', port)

// Create HTTP server.
server = http.createServer(serverSettings)

server.on('error', onError)

server.on('listening', onListening)

server.on('connection', function(socket) {
  sockets.push(socket)
  socket.once('close', function() {
    sockets.splice(sockets.indexOf(socket), 1)
  })
})

ipcMain.on('startServer', function(event) {
  // Listen on provided port, on all network interfaces.
  server.listen(port)
})

ipcMain.on('stopServer', function(event) {
  closeServer()
})
