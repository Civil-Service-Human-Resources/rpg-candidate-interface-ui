const test = require('ava');
const jwt = require('jwt-simple');
const { UserSession } = require('.');

test('class accepts token in constructor', (t) => {
    const token = 'ABC123';
    const session = new UserSession(token);

    t.deepEqual(session.token, 'ABC123');
});

test('if no token supplied, token returns as invalid', (t) => {
    const token = undefined;
    const session = new UserSession(token);

    t.false(session.isValid());
});

test('token is decoded correctly', (t) => {
    const obj = { 'Email Address': 'test@test.com', exp: 1530000221 };
    const secret = 'fsdfsdfsdfdsfwrwwgw';
    const jwtToken = jwt.encode(obj, secret);
    const session = new UserSession(jwtToken);

    t.deepEqual(session.decodedToken, obj);
});

test('class returns email from session token', (t) => {
    const obj = { 'Email Address': 'test@test.com', exp: 1530000221 };
    const secret = 'fsdfsdfsdfdsfwrwwgw';
    const jwtToken = jwt.encode(obj, secret);
    const session = new UserSession(jwtToken);

    t.deepEqual(session.getSessionEmail(), 'test@test.com');
});

test('token is invalid if jwt expiry is in the past', (t) => {
    const obj = { 'Email Address': 'test@test.com', exp: 1529917200 }; // 06/25/2018 @ 9:00am (UTC)
    const secret = 'fsdfsdfsdfdsfwrwwgw';
    const jwtToken = jwt.encode(obj, secret);
    const session = new UserSession(jwtToken);

    t.false(session.isValid());
});

test('token is valid if jwt expiry is in the future', (t) => {
    const obj = { 'Email Address': 'test@test.com', exp: 1561453200 }; // 06/25/2019 @ 9:00am (UTC)
    const secret = 'fsdfsdfsdfdsfwrwwgw';
    const jwtToken = jwt.encode(obj, secret);
    const session = new UserSession(jwtToken);

    t.true(session.isValid());
});
