require('dotenv').config();

var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var hbs = require('express-handlebars');
var url = require('url');

var index = require('./routes/index');
var results = require('./routes/results');
var vacancyDetails = require('./routes/vacancy');
var apply = require('./routes/apply');

var app = express();

// scss compilation middleware
app.use(
  sassMiddleware({
    src: __dirname + '/scss',
    dest: __dirname + '/public/stylesheets',
    prefix: '/stylesheets',
    debug: true,
    sourceMap: true
  })
);

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set("view options", { layout: false });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  const allowedLanguages = ['en', 'cy'];
  let { lang } = req.cookies;

  // if cookie is not one of allowed languages default to English
  if(!allowedLanguages.includes(lang)) {
    lang = 'en';
  }

  const params = url.parse(req.url, true).query;
  if(params.lang && allowedLanguages.includes(params.lang)) {
    res.cookie('lang', params.lang);
    lang = params.lang;
  }

  // load language file
  req['translations'] = JSON.parse(fs.readFileSync(`${path.join(__dirname, 'i18n')}/${lang}.json`));

  next();
});

app.use('/', index);
app.use('/results', results);
app.use('/job', vacancyDetails);
app.use('/apply', apply);

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

module.exports = app;