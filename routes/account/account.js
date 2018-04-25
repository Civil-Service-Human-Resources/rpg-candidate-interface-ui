const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

/* GET apply page. */
router.get('/login', (req, res) => res.render('pages/account/login', {}));

router.get('/create', (req, res) => res.render('pages/account/create', {}));

router.post('/login', [
    // validation rules
    check('email')
        .isLength({ min: 1 })
        .withMessage('global.messages.emailRequired')
        .isEmail()
        .withMessage('global.messages.emailInvalid'),
    check('password')
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
        .isLength({ min: 1 })
        .withMessage('global.messages.fullnameRequired'),
    check('email')
        .isLength({ min: 1 })
        .withMessage('global.messages.emailRequired')
        .isEmail()
        .withMessage('global.messages.emailInvalid'),
    check('password')
        .isLength({ min: 8 })
        .withMessage('global.messages.passwordMinLength'),
    check('repeatpassword')
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

module.exports = router;
