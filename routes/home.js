const express = require('express');

const router = express.Router();

const { homeLdJson } = require('../lib/modules/ldJson');

/* GET home page. */
router.get('/', async (req, res) => {
    const homeJson = await homeLdJson();

    return res.render('pages/home/index', {
        title: __('home.page.title'),
        homeJson,
    });
});

module.exports = router;
