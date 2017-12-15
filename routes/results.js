var express = require('express');
var router = express.Router();
var url = require('url');
var axios = require('axios');

const VIEW_PATH = 'pages/results';
const API_GET_RESULTS_URL = 'http://localhost:8080/vacancy'; // this needs to change once API is updated


axios.interceptors.request.use(request => {
  console.log(request);
  return request;
});

/* GET results page. */
router.get('/', function(req, res, next) {
  var params = url.parse(req.url, true);
  
  axios.get(API_GET_RESULTS_URL)
    .then(response => 
      res.render(VIEW_PATH, {
        page: { title: 'Search Results' },
        total: response.data.length || 0,
        singular: response.data.length === 1,
        results: JSON.stringify(response.data)
      })
    )
  
});

module.exports = router;
