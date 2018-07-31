const express = require('express');

const router = express.Router();

/* GET apply page. */
router.get('/', (req, res) =>
    res.render('pages/privacy/privacyPolicy', {
        title: __('privacyPolicy.page.title'),
    }));

module.exports = router;
