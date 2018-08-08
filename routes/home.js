const express = require('express');
const { siteMapSet } = require('../lib/modules/sitemap');

const router = express.Router();

siteMapSet({
    url: '/',
    lastmodISO: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.5,
});

/* GET home page. */
router.get('/', (req, res) => res.render('pages/index', {
    title: __('home.page.title'),
}));

module.exports = router;
