const express = require('express');
const router = express.Router();

/* GET apply page. */
router.get('/', (req, res) =>
    res.render('pages/cookies', {}) );

module.exports = router;