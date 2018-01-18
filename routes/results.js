const express = require('express');
const router = express.Router();
const url = require('url');

const Pager = require('../lib/modules/pagination');
const { fetchVacancyList, formatResultData } = require('../lib/modules/vacancy');
const { removeUrlParameter } = require('../lib/modules/url');

/* GET results page. */
router.get('/', function(req, res) {
  const filters = url.parse(req.url, true).query;
  const queryString = url.parse(req.url).query;

  const departments = [
      { id: '1', name: "Ministry of Defense" },
      { id: '2', name: "HM Revenue and Customs" },
      { id: '3', name: "Department for Work and Pensions" },
      { id: '4', name: "Department for Transport" },
  ];

  try {
    fetchVacancyList(filters).then(data => {
      
      const url = `/results?${ removeUrlParameter(queryString, 'page') }`;
      const pagerOptions = Pager(
          data.totalPages, 
          data.first, 
          data.last, 
          data.totalElements, 
          data.numberOfElements, 
          url, 
          data.size, 
          data.number
        );
      
      res.render('pages/results', {
        results: formatResultData(data.content),
        filters,
        departments,
        returnUrl: queryString,
        pager: pagerOptions
      });
  });
      
  } catch(e) {
      // need to do unhappy path
  }
  
});

module.exports = router;