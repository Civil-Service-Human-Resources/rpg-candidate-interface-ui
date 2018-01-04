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
    fetchVacancyList(`${process.env.API_URL}:${process.env.API_PORT}/vacancy/search/location/${location}/keyword/${keyword}`).then(data => {
        res.render(VIEW_PATH, {
          i18n: {
            ...req.translations,
            title: req.translations.results.page.title,
            resultsTotal: data.length === 1 ? req.translations.results.page.totalJobsFoundSingular : req.translations.results.page.totalJobsFoundPlural
          },
          total: data.length || 0,
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
  return data.content;
}

function formatSalaryNumber(num) {
  return num.toLocaleString();
}

function formatResultData(results = []) {
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