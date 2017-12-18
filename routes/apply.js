var express = require('express');
var router = express.Router();
var url = require('url');

const VIEW_PATH = 'pages/apply/index';

/* GET apply page. */
router.get('/:id', function(req, res, next) {
   
    res.render(VIEW_PATH, {
        page: { title: 'Apply' }
    })
    
});

module.exports = router;