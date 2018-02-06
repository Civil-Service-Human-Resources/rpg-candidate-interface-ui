const express = require('express');
const url = require('url');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

/* GET home page. */
router.get('/', [
    // validation rules
    check('location')
        .trim()
        .isLength({ min: 1 }).withMessage('global.messages.locationRequired'),

], (req, res) => {
    const queryString = url.parse(req.url).query;
    const formData = url.parse(req.url, true).query;
    const validate = validationResult(req);

    // if the form was valid, redirect to results page
    if (queryString && validate.isEmpty()) {
        return res.redirect(`/results?${queryString}`);
    }
    return res.render('pages/index', {
        errors: queryString ? validate.mapped() : null,
        formData,
    });
});

module.exports = router;