const express = require('express');
const router = express.Router();

/* GET apply page. */
router.get('/:id', function(req, res) {
   
    res.render('pages/apply/index', {
        i18n: { 
            ...req.translations,
            title: req.translations.apply.page.title
        }
    })
    
});

module.exports = router;