const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => res.render('pages/index', {
    title: __('home.page.title'),
}));

module.exports = router;
