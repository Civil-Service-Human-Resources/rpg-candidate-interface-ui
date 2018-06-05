class CSHRError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, CSHRError);
    }
}

module.exports = CSHRError;
