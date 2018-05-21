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
const fs = require('fs');
const uuid = require('uuid');
const ns = require('continuation-local-storage').createNamespace('candidate-interface');
const helmet = require('helmet');
const nocache = require('nocache');

const { objectToUrl } = require('./lib/modules/url');
const routes = require('./routes');
const logger = require('./lib/modules/logger');

if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

const app = express();
// Add helmet to set security headers
app.use(helmet());
app.use(nocache());

// scss compilation middleware
app.use(sassMiddleware({
    src: `${__dirname}/scss`,
    dest: `${__dirname}/public/stylesheets`,
    prefix: '/stylesheets',
    outputStyle: 'compressed',
    debug: false,
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
    register: global,
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
    ns.run(() => {
        ns.set('reqId', uuid.v1());
        next();
    });
});

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

app.use((req, res, next) => {
    const { cookieWarningSeen = false } = req.cookies;

    if (!cookieWarningSeen) {
        res.cookie('cookieWarningSeen', true, { maxAge: 2592000000 }); // 30 days in milliseconds
    }

    res.locals.showCookieWarning = !cookieWarningSeen;

    return next();
});

// parent routes
app.use('/', routes.home);
app.use('/results', routes.results);
app.use('/job', routes.vacancyDetails);
app.use('/privacy-notice', routes.privacyPolicy);
app.use('/cookies', routes.cookies);
app.use('/account', routes.account);

// catch 404 and log error
app.use((req, res) => {
    logger.error(`404 Page not found - '${req.url}'`);
    res.status(404);
    res.render('pages/errors/404', {});
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let errorObj = {};

    if (err.custom) {
        errorObj = { ...err };
    } else {
        errorObj = {
            status: err.statusCode,
            message: `${err.code} ${err.message}`,
            url: req.url,
            custom: true,
        };
    }

    logger.error(errorObj);
    const { status = 500, message } = errorObj;
    const viewTemplate = `pages/errors/${status}`;

    res.status(status);
    return res.render(viewTemplate, { errors: message });
});

module.exports = app;
