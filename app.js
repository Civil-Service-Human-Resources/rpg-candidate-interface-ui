require('dotenv').config();

const compression = require('compression');
const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const exphbs = require('express-handlebars');
const url = require('url');

const index = require('./routes/index');
const results = require('./routes/results');
const vacancyDetails = require('./routes/vacancy');
const apply = require('./routes/apply');

const app = express();
app.use(compression());

// scss compilation middleware
app.use(
  sassMiddleware({
    src: __dirname + '/scss',
    dest: __dirname + '/public/stylesheets',
    prefix: '/stylesheets',
    outputStyle: 'compressed',
    debug: true,
    sourceMap: true
  })
);

const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  helpers: {

    // simple compare function similar to an if === conditional
    // returns boolean
    compare: function(a, b, block) { 
      return a === b ? block.fn(this) : block.inverse(this) 
    }
    
  }
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set("view options", { layout: false });

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
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;