const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');

/* GET home page. */
router.get('/', [
    // validation rules

    check('location')
        .isLength({min: 1}).withMessage("Location is required")

], (req, res) => {

    const validate = validationResult(req);

    res.render('pages/index', {
        i18n: {
            ...req.translations,
            title: req.translations.home.page.title
        },
        errors: validate.mapped()
    });

});

module.exports = router;
