const express = require('express');
const router = express.Router();
const url = require('url');
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', [
    // validation rules

    check('location')
        .isLength({min: 1}).withMessage("Location is a required field"),

], (req, res) => {

    const queryString = url.parse(req.url).query;
    const formData = url.parse(req.url, true).query;
    const validate = validationResult(req);
    const errors = validate.mapped();

    // if the form was valid, redirect to results page
    if(queryString && validate.isEmpty()) {
        return res.redirect(`/results?${ queryString }`)
    }

    res.render('pages/index', {
        i18n: {
            ...req.translations,
            title: `${ queryString && errors ? 'Errors: ' : '' }${req.translations.home.page.title}`
        },
        errors: queryString ? validate.mapped() : null,
        formData
    });

});

module.exports = router;
