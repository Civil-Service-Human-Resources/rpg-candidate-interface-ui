const { getNamespace } = require('continuation-local-storage');
const winston = require('winston');

const fileLoggerOptions = {
    handleExceptions: true,
    json: true,
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

const winstonLogger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name: 'file.info',
            level: 'info',
            filename: './logs/info.log',
            ...fileLoggerOptions,
        }),
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

winstonLogger.stream = {
    write: (message) => {
        winstonLogger.info(message);
    },
};

const formatMessage = (msg) => {
    const request = getNamespace('candidate-interface');
    const message = request && request.get('reqId') ? `${JSON.stringify(request)} reqId: ${request.get('reqId')}` : msg;

    return message;
};

const logger = {
    log: (level, message) => winstonLogger.log(level, formatMessage(message)),
    error: (level, message) => winstonLogger.error(level, formatMessage(message)),
    warn: (level, message) => winstonLogger.warn(level, formatMessage(message)),
    verbose: (level, message) => winstonLogger.verbose(level, formatMessage(message)),
    info: (level, message) => winstonLogger.info(level, formatMessage(message)),
    debug: (level, message) => winstonLogger.debug(level, formatMessage(message)),
    silly: (level, message) => winstonLogger.silly(level, formatMessage(message)),
};

module.exports = logger;
