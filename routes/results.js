const express = require('express');
const url = require('url');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

const {
    fetchVacancyList,
    isResultsPerPageValid, isRadiusValidOption,
    isMinSalaryValidOption, isMaxSalaryValidOption,
    RESULTS_PER_PAGE_OPTIONS, DEFAULT_RESULTS_PER_PAGE,
    LOCATION_RADIUS_OPTIONS, DEFAULT_LOCATION_RADIUS,
    MIN_SALARY_OPTIONS, MAX_SALARY_OPTIONS,
} = require('../lib/modules/vacancy');
const { fetchDepartmentList } = require('../lib/modules/department');
const { removeUrlParameter } = require('../lib/modules/url');

/* GET results page. */
router.get('/', [

    check('radius')
        .trim()
        .custom(value => (value ? isRadiusValidOption(value) : true))
        .withMessage('global.messages.invalidRadius'),

    check('minSalary')
        .trim()
        .custom(value => (value ? isMinSalaryValidOption(value) : true))
        .withMessage('global.messages.invalidMinSalary'),

    check('maxSalary')
        .trim()
        .custom(value => (value ? isMaxSalaryValidOption(value) : true))
        .withMessage('global.messages.invalidMaxSalary'),

], async (req, res, next) => {
    const queryString = url.parse(req.url).query;

    // if someone is trying to access the page with not filters
    // redirect to home
    if (!queryString) {
        return res.redirect('/');
    }

    const filters = url.parse(req.url, true).query;
    const pagerUrl = `/results?${removeUrlParameter(queryString, 'page')}`;
    const validate = validationResult(req);

    const cookieRpp = req.cookies.resultsPerPage;

    if (filters.size) {
        // if user as selected an option for results per page
        res.cookie('resultsPerPage', filters.size);
    } else {
        // otherwise check if cookie exists or use default
        filters.size = cookieRpp || DEFAULT_RESULTS_PER_PAGE;
    }

    // if the request contains an invalid option set it to default
    if (!isResultsPerPageValid(filters.size)) {
        filters.size = DEFAULT_RESULTS_PER_PAGE;
    }

    if (!isRadiusValidOption(filters.radius)) {
        filters.radius = DEFAULT_LOCATION_RADIUS;
    }

    if (filters.depts === '') {
        delete filters.depts;
    }

    const departments = await fetchDepartmentList(next);
    const { vacancies, params, vacancyErrors } = await fetchVacancyList(filters, next);
    if (vacancyErrors.length > 0) {
        // console.log(vacancyErrors);
        res.locals.jwtInvalid = true;
        res.clearCookie('session_token');
        res.locals.userEmail = null;
    }

    // grabbing logos directory to check existence of logo file. Temporary until future story
    // changing to CDN based file storage
    const pager = {
        totalResults: params.totalElements || 0,
        totalPages: params.totalPages,
        currentPage: params.number + 1,
        prevPage: params.number,
        nextPage: params.number + 2,
        firstPage: params.first,
        lastPage: params.last,
        url: pagerUrl,
    };

    // if only one department selected, we get department filters
    // as a string rather than an array so we need to convert it
    // to stop the filters blowing up
    if (typeof filters.depts === 'string') {
        filters.depts = [filters.depts];
    }

    return res.render('pages/results', {
        title: `${__('results.page.title')} | Page ${pager.currentPage || 1}`,
        departments,
        filters,
        pager,
        vacancies,
        returnUrl: queryString,
        options: {
            rrp: RESULTS_PER_PAGE_OPTIONS,
            radius: LOCATION_RADIUS_OPTIONS,
            salary: {
                min: MIN_SALARY_OPTIONS,
                max: MAX_SALARY_OPTIONS,
            },
        },
        errors: !validate.isEmpty() ? validate.mapped() : null,
    });
});

module.exports = router;
