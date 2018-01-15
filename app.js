require('dotenv').config();

const compression = require('compression');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const exphbs = require('express-handlebars');
const i18n = require('i18n');

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

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// i18n setup
i18n.configure({
    locales: ['en', 'cy'],
    defaultLocale: 'en',
    cookie: 'lang',
    objectNotation: true,
    directory: __dirname + '/i18n',
    queryParameter: 'lang'
});
app.use(i18n.init);

// handlebars configuration
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  helpers: {
    compare: function(a, b, block) { return a === b ? block.fn(this) : block.inverse(this) }, // compare one value with another
  }
});

app.use(function(req, res, next) {
    // I'm having to register these helpers here due to needing
    // to pass req as apply context otherwise translations don't work!
    hbs.handlebars.registerHelper('__', function() {
        return i18n.__.apply(req, arguments);
    });
    hbs.handlebars.registerHelper('__n', function() {
        return i18n.__n.apply(req, arguments);
    });

    next();
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set("view options", { layout: false });

app.use(function(req, res, next) {
    res.cookie('lang', res.getLocale());
    next();
});

// parent routes
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