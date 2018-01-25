const express = require('express');
const router = express.Router();
const url = require('url');

const Pager = require('../lib/modules/pagination');
const { fetchVacancyList, formatResultsData } = require('../lib/modules/vacancy');
const { fetchDepartmentList, getDepartmentLogos } = require('../lib/modules/department');
const { removeUrlParameter } = require('../lib/modules/url');

/* GET results page. */
router.get('/', async function(req, res) {
  const filters = url.parse(req.url, true).query;
  const queryString = url.parse(req.url).query;
  const pagerUrl = `/results?${ removeUrlParameter(queryString, 'page') }`;

  const departments = await fetchDepartmentList();
  const vacancies = await fetchVacancyList(filters);

  // grabbing logos directory to check existance of logo file. Temporary until future story
  // changing to CDN based file storage
  const logos = getDepartmentLogos();
  const pager = {
      showSummary: true,
      totalResults: vacancies.totalElements,
      totalPages: vacancies.totalPages,
      currentPage: vacancies.number + 1,
      prevPage: vacancies.number,
      nextPage: vacancies.number + 2,
      firstPage: vacancies.first,
      lastPage: vacancies.last,
      url: pagerUrl
  };

  // if only one department selected, we get department filters
  // as a string rather than an array so we need to convert it
  // to stop the filters blowing up
  if(typeof filters.depts === 'string') {
      filters.depts = [filters.depts];
  }

  res.render('pages/results', {
      results: formatResultsData(vacancies.content, logos),
      filters,
      departments: departments.content,
      returnUrl: queryString,
      pager: vacancies.totalPages > 1 ? pager : false
  });
  
});

module.exports = router;