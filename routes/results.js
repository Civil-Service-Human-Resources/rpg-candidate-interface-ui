var express = require('express');
var router = express.Router();
var url = require('url');
var axios = require('axios');

const VIEW_PATH = 'pages/results';

axios.interceptors.request.use(request => {
  console.log(request);
  return request;
});

/* GET results page. */
router.get('/', function(req, res, next) {
  const { location, keyword } = url.parse(req.url, true).query;
  
  // NOTE: I'm going to rewrite this using javascript Fetch API
  axios.get(`http://localhost:8080/vacancy/search/location/${location}/keyword/${keyword}`)
    .then(response => 
      res.render(VIEW_PATH, {
        page: { title: 'Search Results' },
        total: response.data.length || 0,
        singular: response.data.length === 1,
        results: formatResultData(response.data)
      })
    )
  
});

function formatSalaryNumber(num) {
  return num.toLocaleString();
}

function formatResultData(results) {
  return results.map(result => {
    const salary = formatSalaryOutput(result.salaryMin, result.salaryMax);
    return { ...result, salary }
  });
}

function formatSalaryOutput(min, max) {
  if(min !== 0 && max !== 0) {
    return `£${formatSalaryNumber(min)} - £${formatSalaryNumber(max)}`;
  }

  if(max === 0) {
    return `£${formatSalaryNumber(min)}`;
  }

  if(min === 0) {
    return `£${formatSalaryNumber(max)}`;
  }
}

module.exports = router;