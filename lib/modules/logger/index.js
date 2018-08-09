const { getNamespace } = require('continuation-local-storage');
const winston = require('winston');

const fileLoggerOptions = {
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    timestamp: true,
};

const consoleLoggerOptions = {
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
};

const winstonLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            name: 'file.error',
            level: 'error',
            filename: './logs/errors.log',
            ...fileLoggerOptions,
        }),
        new winston.transports.Console({
            level: 'error',
            ...consoleLoggerOptions,
        }),
    ],
    exitOnError: false,
});

const formatMessage = (obj) => {
    const request = getNamespace('candidate-interface');

    return `${obj.status || ''} ${obj.message || ''} ${obj.url || ''} | reqId: ${request.get('reqId')}`;
};

const logger = {
    log: (level, message) => winstonLogger.log(level, formatMessage(message)),
    error: err => winstonLogger.error(formatMessage(err)),
    warn: (level, message) => winstonLogger.warn(level, formatMessage(message)),
    verbose: (level, message) => winstonLogger.verbose(level, formatMessage(message)),
    info: (level, message) => winstonLogger.info(level, formatMessage(message)),
    debug: (level, message) => winstonLogger.debug(level, formatMessage(message)),
    silly: (level, message) => winstonLogger.silly(level, formatMessage(message)),
};

module.exports = logger;
