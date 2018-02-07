const express = require('express');

const router = express.Router();

/* GET apply page. */
router.get('/:id', (req, res) =>
    res.render('pages/apply/index', {}));

module.exports = router;
