const express = require('express');
const router = express.Router();
const url = require('url');
const fetch = require('node-fetch');

const pager = require('../lib/modules/pagination');
const UrlUtils = require('../lib/modules/url');

const VIEW_PATH = 'pages/results';

/* GET results page. */
router.get('/', function(req, res) {
  const { location, keyword, page = 0 } = url.parse(req.url, true).query;
  const queryString = url.parse(req.url).query;

  try {
    fetchVacancyList(`${process.env.API_URL}:${process.env.API_PORT}/vacancy/search/location/${location || null}/keyword/${keyword || null}?page=${page - 1}`).then(data => {
      
      const url = `/results?${ UrlUtils.removeUrlParameter(queryString, 'page') }`;
      const pagerOptions = pager(
          data.totalPages, 
          data.first, 
          data.last, 
          data.totalElements, 
          data.numberOfElements, 
          url, 
          data.size, 
          data.number
        );
      
      res.render(VIEW_PATH, {
        i18n: {
          ...req.translations,
          title: req.translations.results.page.title,
          resultsTotal: data.totalElements === 1 ? req.translations.results.page.totalJobsFoundSingular : req.translations.results.page.totalJobsFoundPlural
        },
        results: formatResultData(data.content),
        filters: { location, keyword },
        returnUrl: queryString,
        pager: pagerOptions
      })
  });
      
  } catch(e) {
      // need to do unhappy path
  }
  
});

async function fetchVacancyList(url) {
  let response = await fetch(url);
  return await response.json();
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