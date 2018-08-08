const express = require('express');
const { siteMapSet } = require('../lib/modules/sitemap');

const router = express.Router();

siteMapSet({
    url: '/terms-conditions',
    lastmodISO: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.2,
});

/* GET apply page. */
router.get('/', (req, res) =>
    res.render('pages/terms', {
        title: __('terms.page.title'),
    }));

module.exports = router;
