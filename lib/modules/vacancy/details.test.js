const test = require('ava');
const { generateReturnURL } = require('.');

test(`return url property is removed from query string`, t => {
    const returnUrl = generateReturnURL('return_url=keyword=Analyst&location=London&page=1');
    const expected = '/results?keyword=Analyst&location=London&page=1';

    t.deepEqual(returnUrl, expected);
});