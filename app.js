require('dotenv').config();

const compression = require('compression');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const exphbs = require('express-handlebars');
const i18n = require('i18n');
const url = require('url');
const log4js = require('log4js');

const { objectToUrl } = require('./lib/modules/url');

const index = require('./routes/index');
const results = require('./routes/results');
const vacancyDetails = require('./routes/vacancy');
const apply = require('./routes/apply');

// configure logging
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'logs/info.log', backups: 10, maxLogSize: 10485760 },
        issues: { type: 'file', filename: 'logs/errors.log', backups: 10, maxLogSize: 10485760 },
        'just-errors': { type: 'logLevelFilter', appender: 'issues', level: 'error' }
    },
    categories: {
        default: { appenders: ['just-errors', 'everything'], level: 'debug' }
    }
});
const logger = log4js.getLogger();

const app = express();
app.use(log4js.connectLogger(logger, {
    level: 'auto',
    nolog: ["\\.jpg$", "\\.png", "\\.gif", "\\.css", "\\.js", "\\.ico"]
}));

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

app.use(compression());
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

app.use((req, res, next) => {
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

app.use((req, res, next) => {
    res.cookie('lang', res.getLocale());
    next();
});

// if someones hit translate link, we want to remove it from url
app.use((req, res, next) => {
    const params = url.parse(req.url, true).query;

    if(params.lang) {
        delete params.lang;
        let newQueryString = objectToUrl(params, 'lang');

        return newQueryString !== '' ? res.redirect(`/?${newQueryString}`) : res.redirect(`/${newQueryString}`);
    }

    next();
});

// parent routes
app.use('/', index);
app.use('/results', results);
app.use('/job', vacancyDetails);
app.use('/apply', apply);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;