const express = require('express');

const router = express.Router();

/* GET verify email. */
router.get('/:jwt', (req, res) => {
    const { jwt } = req.params;

    res.cookie('session_token', jwt, { maxAge: 2592000000 });
    res.redirect('/results?keyword=&location=');
});

module.exports = router;
