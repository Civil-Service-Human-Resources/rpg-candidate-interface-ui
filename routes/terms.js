const express = require('express');

const router = express.Router();

/* GET apply page. */
router.get('/', (req, res) => res.render('pages/terms', {
    title: __('terms.page.title'),
}));

module.exports = router;
