const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

const PASSWORD_REGEX = RegExp('^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$');

/* GET apply page. */
router.get('/signin', (req, res) => res.render('pages/account/login', {}));

router.get('/create', (req, res) => res.render('pages/account/create', {}));

router.get('/activate', (req, res) => res.render('pages/account/activate', {}));

router.post('/signin', [
    // validation rules
    check('email')
        .trim()
        .isLength({ min: 1 })
        .withMessage('global.messages.emailRequired')
        .isEmail()
        .withMessage('global.messages.emailInvalid'),
    check('password')
        .trim()
        .isLength({ min: 1 })
        .withMessage('global.messages.passwordRequired'),

], (req, res) => {
    const validate = validationResult(req);
    const formData = req.body;

    return res.render('pages/account/login', {
        errors: validate.mapped(),
        formData,
    });
});

router.post('/create', [
    // validation rules
    check('fullname')
        .trim()
        .isLength({ min: 1 })
        .withMessage('global.messages.fullnameRequired'),
    check('email')
        .trim()
        .isLength({ min: 1 })
        .withMessage('global.messages.emailRequired')
        .isEmail()
        .withMessage('global.messages.emailInvalid'),
    check('password')
        .trim()
        .custom(value => !PASSWORD_REGEX.test(value))
        .withMessage('global.messages.passwordRuleFailure'),
    check('repeatpassword')
        .trim()
        .isLength({ min: 1 })
        .withMessage('global.messages.emailRepeatRequired')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('global.messages.passwordsMustMatch'),


], (req, res) => {
    const validate = validationResult(req);
    const formData = req.body;

    return res.render('pages/account/create', {
        errors: validate.mapped(),
        formData,
    });
});

router.post('/activate', [
    // validation rules
    check('code')
        .isLength({ min: 1 })
        .withMessage('global.messages.activationCodeRequired'),
], (req, res) => {
    const validate = validationResult(req);
    const formData = req.body;

    return res.render('pages/account/activate', {
        errors: validate.mapped(),
        formData,
    });
});

module.exports = router;
