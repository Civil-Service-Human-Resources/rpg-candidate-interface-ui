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
const routes = require('./routes');

// configure logging
log4js.configure({
    appenders: {
        everything: {
            type: 'file',
            filename: 'logs/info.log',
            backups: 10,
            maxLogSize: 10485760,
        },
        issues: {
            type: 'file',
            filename: 'logs/errors.log',
            backups: 10,
            maxLogSize: 10485760,
        },
        'just-errors': {
            type: 'logLevelFilter',
            appender: 'issues',
            level: 'error',
        },
    },
    categories: {
        default: { appenders: ['just-errors', 'everything'], level: 'debug' },
    },
});
const logger = log4js.getLogger();

const app = express();
app.use(log4js.connectLogger(logger, {
    level: 'auto',
    nolog: ['\\.jpg$', '\\.png', '\\.gif', '\\.css', '\\.js', '\\.ico'],
}));

// scss compilation middleware
app.use(sassMiddleware({
    src: `${__dirname}/scss`,
    dest: `${__dirname}/public/stylesheets`,
    prefix: '/stylesheets',
    outputStyle: 'compressed',
    debug: true,
    sourceMap: true,
}));

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
    directory: `${__dirname}/i18n`,
    queryParameter: 'lang',
});
app.use(i18n.init);

// handlebars configuration
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: `${__dirname}/views/`,
    helpers: {
        compare: (a, b, block) =>
            (a === b ? block.fn(this) : block.inverse(this)),
        inArray: (arr = [], b, block) =>
            (arr.includes(b.toString()) ? block.fn(this) : block.inverse(this)),
    },
});

app.use((req, res, next) => {
    // I'm having to register these helpers here due to needing
    // to pass req as apply context otherwise translations don't work!
    hbs.handlebars.registerHelper('__', (...args) => i18n.__.apply(req, args));
    hbs.handlebars.registerHelper('__n', (...args) => i18n.__n.apply(req, args));

    return next();
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: false });

app.use((req, res, next) => {
    res.cookie('lang', res.getLocale());
    next();
});

// if someones hit translate link, we want to remove it from url
app.use((req, res, next) => {
    const params = url.parse(req.url, true).query;

    if (params.lang) {
        delete params.lang;
        const newQueryString = objectToUrl(params, 'lang');

        return newQueryString !== '' ? res.redirect(`/?${newQueryString}`) : res.redirect(`/${newQueryString}`);
    }

    return next();
});

// parent routes
app.use('/', routes.home);
app.use('/results', routes.results);
app.use('/job', routes.vacancyDetails);
app.use('/apply', routes.apply);
app.use('/privacy-policy', routes.privacyPolicy);
app.use('/cookies', routes.cookies);

// catch 404 and log error
app.use((req, res) => {
    logger.error(`404 Not Found "${req.method} ${req.originalUrl} 404" "${req.headers['user-agent']}"`);
    res.render('pages/errors/notFound', {});
});

module.exports = app;
