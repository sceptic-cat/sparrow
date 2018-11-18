var createError = require('http-errors');
var express = require('express');
var path = require('path');
var config = require('./config');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var mongoose = require('./libs/mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


/** Сессии */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose_store = new MongoStore({mongooseConnection: mongoose.connection});

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: config.get('sessions:secret'),
    key: config.get('sessions:key'),
    cookie: config.get('sessions:cookie'),
    saveUninitialized: false,
    resave: false,
    store: mongoose_store
}));﻿
/*
app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    resave: false,
    cookie: config.get('session:cookie'),
    //Берем настройки из подключения mongoose (берется не само подключение, а только настройки)
    store: new MongoStore({mongoose_connection: mongoose.connection})
}));
*/

/*app.use(function(req, res, next){
   req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
   res.send("Visits: " + req.session.numberOfVisits);
});*/

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
