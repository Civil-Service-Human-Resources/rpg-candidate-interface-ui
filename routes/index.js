var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('pages/index', {
    i18n: { 
      ...req.translations, 
      title: req.translations.home.page.title 
    }
  });

});

module.exports = router;
