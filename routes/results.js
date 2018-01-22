const express = require('express');
const router = express.Router();
const url = require('url');

const Pager = require('../lib/modules/pagination');
const { fetchVacancyList, formatResultData } = require('../lib/modules/vacancy');
const { fetchDepartmentList } = require('../lib/modules/department');
const { removeUrlParameter } = require('../lib/modules/url');

/* GET results page. */
router.get('/', async function(req, res) {
  const filters = url.parse(req.url, true).query;
  const queryString = url.parse(req.url).query;
  const pagerUrl = `/results?${ removeUrlParameter(queryString, 'page') }`;

  const departments = await fetchDepartmentList();
  const vacancies = await fetchVacancyList(filters);

  const pagerOptions = Pager(
      vacancies.totalPages,
      vacancies.first,
      vacancies.last,
      vacancies.totalElements,
      vacancies.numberOfElements,
      pagerUrl,
      vacancies.size,
      vacancies.number
  );

  res.render('pages/results', {
      results: formatResultData(vacancies.content),
      filters,
      departments: departments.content,
      returnUrl: queryString,
      pager: pagerOptions
  });
  
});

module.exports = router;