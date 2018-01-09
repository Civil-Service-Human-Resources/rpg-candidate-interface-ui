const express = require('express');
const router = express.Router();

const VIEW_PATH = 'pages/apply/index';

/* GET apply page. */
router.get('/:id', function(req, res) {
   
    res.render(VIEW_PATH, {
        i18n: { 
            ...req.translations,
            title: req.translations.apply.page.title
        }
    })
    
});

module.exports = router;