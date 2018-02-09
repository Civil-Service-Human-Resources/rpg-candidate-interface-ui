const express = require('express');
const url = require('url');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

const {
    fetchVacancyList, formatResultsData, isResultsPerPageValid, isRadiusValidOption,
    RESULTS_PER_PAGE_OPTIONS, DEFAULT_RESULTS_PER_PAGE,
    LOCATION_RADIUS_OPTIONS, DEFAULT_LOCATION_RADIUS,
    MIN_SALARY_OPTIONS, MAX_SALARY_OPTIONS,
} = require('../lib/modules/vacancy');
const { fetchDepartmentList, getDepartmentLogos } = require('../lib/modules/department');
const { removeUrlParameter } = require('../lib/modules/url');

/* GET results page. */
router.get('/', [

    check('location')
        .trim()
        .isLength({ min: 1 })
        .withMessage('global.messages.locationRequired'),

    check('radius')
        .trim()
        .custom(value => (value ? isRadiusValidOption(value) : true))
        .withMessage('global.messages.invalidRadius'),


], async (req, res) => {
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

    const departments = await fetchDepartmentList();
    const vacancies = validate.isEmpty() ? await fetchVacancyList(filters) : [];


    // grabbing logos directory to check existance of logo file. Temporary until future story
    // changing to CDN based file storage
    const logos = getDepartmentLogos();
    const pager = {
        totalResults: vacancies.totalElements || 0,
        totalPages: vacancies.totalPages,
        currentPage: vacancies.number + 1,
        prevPage: vacancies.number,
        nextPage: vacancies.number + 2,
        firstPage: vacancies.first,
        lastPage: vacancies.last,
        url: pagerUrl,
    };

    // if only one department selected, we get department filters
    // as a string rather than an array so we need to convert it
    // to stop the filters blowing up
    if (typeof filters.depts === 'string') {
        filters.depts = [filters.depts];
    }

    return res.render('pages/results', {
        results: formatResultsData(vacancies.content, logos),
        filters,
        departments: departments.content,
        returnUrl: queryString,
        pager,
        rrpOptions: RESULTS_PER_PAGE_OPTIONS,
        radiusOptions: LOCATION_RADIUS_OPTIONS,
        salaryOptions: {
            min: MIN_SALARY_OPTIONS,
            max: MAX_SALARY_OPTIONS,
        },
        errors: !validate.isEmpty() ? validate.mapped() : null,
    });
});

module.exports = router;
