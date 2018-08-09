const express = require('express');
const { siteMapSet } = require('../lib/modules/sitemap');

const router = express.Router();

siteMapSet({
    url: '/privacy-notice',
    lastmodISO: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.2,
});
/* GET apply page. */
router.get('/', (req, res) => res.render('pages/privacyPolicy', {
    title: __('privacyPolicy.page.title'),
}));

module.exports = router;
