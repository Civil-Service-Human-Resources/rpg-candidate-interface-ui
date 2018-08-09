const express = require('express');
const { siteMapSet } = require('../lib/modules/sitemap');

const router = express.Router();

const { homeLdJson } = require('../lib/modules/ldJson');

siteMapSet({
    url: '/',
    lastmodISO: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.5,
});

/* GET home page. */
router.get('/', async (req, res) => {
    const homeJson = await homeLdJson();

    return res.render('pages/index', {
        title: __('home.page.title'),
        homeJson,
    });
});

module.exports = router;
