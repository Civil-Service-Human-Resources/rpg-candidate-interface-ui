var express = require('express');
var router = express.Router();
var url = require('url');
var fetch = require('node-fetch');

const VIEW_PATH = 'pages/results';

/* GET results page. */
router.get('/', function(req, res, next) {
  const { location, keyword } = url.parse(req.url, true).query;
  const query_string = url.parse(req.url).query;

  try {
    fetchVacancyList(`http://localhost:8080/vacancy/search/location/${location}/keyword/${keyword}`).then(data => {
        res.render(VIEW_PATH, {
          page: { title: 'Search Results' },
          total: data.length || 0,
          singular: data.length === 1,
          results: formatResultData(data),
          return_url: query_string
        })
    });
      
  } catch(e) {
      // need to do unhappy path
  }
  
});

async function fetchVacancyList(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

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