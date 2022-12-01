var createError = require('http-errors'),
 express = require('express'),
 path = require('path'),
 cookieParser = require('cookie-parser'),
 logger = require('morgan'),
 systemInfo = require('./scripts/systeminfo'),
 indexRouter = require('./routes/index'),
 app = express(),
 http = require('http'),
 WebSocketServer = require('ws').Server,
 crypto = require('crypto'),
 childProcess = require('child_process');

server = http.createServer(app);
server.listen(8999);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var systemInfoSocket = new WebSocketServer({server: server, path: '/echo'});
systemInfoSocket.on('connection', (ws) => {
  var sendSystemInfo = async () => {
    let result = await systemInfo();;
    ws.send(JSON.stringify(result));
  }
  setInterval(sendSystemInfo, 1000);
})


var shellSessions = new Map();

server = http.createServer(app);
server.listen(9000);
var shellServer = new WebSocketServer({server: server, path: '/shell'});

shellServer.on('connection', (ws) => {
  let shellSession = childProcess.spawn('bash');

  ws.on('message', message => {
    shellSession.stdin.write(message + "\n");
  });

  shellSession.stdout.on('data', data => {
    ws.send(data.toString());
  })

  shellSessions.set(ws, shellSession);

});


shellServer.on('close', (ws) => {
  shellSessions.remove(shellSessions[shellServer.clients.find(ws)]);
});


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
