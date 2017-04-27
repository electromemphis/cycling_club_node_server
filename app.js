var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

var index = require('./routes/index');
var users = require('./routes/users');
var clubs = require('./routes/clubs');
var events = require('./routes/events');
var newclub = require('./routes/newclub');
var insertUser = require('./routes/insertUser');
var removeUser = require('./routes/removeUser');
var clubDetail = require('./routes/clubdetail');

var app = express();
// let http = require('http').Server(app);
// var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/clubs', clubs);
app.use('/club/detail',clubDetail);
app.use('/events', events);
app.use('/newclub', newclub);
app.use('/insertUser', insertUser);
app.use('/removeUser', removeUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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

// io.on('connection',(socket)=>{
//     console.log("SOCKET CONNECTED!");
//     socket.on('disconnect',()=>{
//         console.log("SOCKET DISCONNECTED");
//     });

//     socket.on('stop-emergency',(event)=>{
//         console.log("SOCKET STOP EMERGENCY");
//         io.emit('message',{type:"stop",event:event});
//     });

//     socket.on('emergency-message', (event) => {
//          console.log("SOCKET RECEIVED MESSAGE="); 
//         io.emit('message', {type:'new-message', event: event});    
//     });
// });

// const port = 3000;
// http.listen(port, ()=>{
//     console.log('server started on port ... '+port);
// });

module.exports = app;