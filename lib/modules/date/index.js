const moment = require('moment');

const gdsDateFormat = dateString => (dateString ? moment(dateString).format('D MMMM YYYY') : null);

module.exports = {
    gdsDateFormat,
};
