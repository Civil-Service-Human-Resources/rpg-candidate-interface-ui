const test = require('ava');
const { gdsDateFormat } = require('.');

test('date is formatted corrently', (t) => {
    const beforeDate = '2018-05-10 00:00:00';
    const afterDate = '10 May 2018';

    t.deepEqual(gdsDateFormat(beforeDate), afterDate);
});

test('date is formatting corrently and day is single digit', (t) => {
    const beforeDate = '2018-10-05 00:00:00';
    const afterDate = '5 October 2018';

    t.deepEqual(gdsDateFormat(beforeDate), afterDate);
});
