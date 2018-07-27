const express = require('express');
const { siteMapSet } = require('../lib/modules/sitemap');

const router = express.Router();

siteMapSet({ url: '/' });

/* GET home page. */
router.get('/', (req, res) => res.render('pages/index', {
    title: __('home.page.title'),
}));

module.exports = router;
