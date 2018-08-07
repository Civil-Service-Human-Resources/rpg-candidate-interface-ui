const express = require('express');
const { siteMapSet } = require('../lib/modules/sitemap');

const router = express.Router();

siteMapSet({
    url: '/privacy-notice',
    lastmodISO: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.5,
});
/* GET apply page. */
router.get('/', (req, res) =>
    res.render('pages/privacyPolicy', {
        title: __('privacyPolicy.page.title'),
    }));

module.exports = router;
