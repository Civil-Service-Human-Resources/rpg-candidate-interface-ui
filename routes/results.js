var express = require('express');
var router = express.Router();
var url = require('url');

/* GET results page. */
router.get('/', function(req, res, next) {
  var params = url.parse(req.url, true);
  res.render('pages/results', {
    page: {
      title: 'Search Results'
    },
    keyword: params.query.keyword 
  });
});

module.exports = router;
