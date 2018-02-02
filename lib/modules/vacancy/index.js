const fetch = require('node-fetch');
const { doesDepartmentLogoExist } = require('../department');
const { gdsDateFormat } = require('../date');

const DEFAULT_RESULTS_PER_PAGE = '10';
const RESULTS_PER_PAGE_OPTIONS = [
    { value: '5', label: '5 per page' },
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' }
];

const DEFAULT_LOCATION_RADIUS = '30';
const LOCATION_RADIUS_OPTIONS = [
    { value: '2', label: '2 miles' },
    { value: '5', label: '5 miles' },
    { value: '10', label: '10 miles' },
    { value: '15', label: '15 miles' },
    { value: '20', label: '20 miles' },
    { value: '30', label: '30 miles' },
    { value: '50', label: '50 miles' },
];

const fetchVacancyList = async function({ location = '', keyword = '', depts = [], size = '10', radius = DEFAULT_LOCATION_RADIUS, page = 0 }) {

    const url = `${ process.env.API_URL }:${process.env.API_PORT}/vacancy/search?size=${size}&page=${page-1}`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          keyword,
          location: {
            place: location,
            radius
          },
          department: typeof depts === 'string' ? [depts] : depts
      })
    };

    try {
        return await fetch(url, options).then(response => response.json());
    } catch(e) {
        // needs error logging
        return null;
    }
};

const fetchVacancyDetails = async function(id) {
    let response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}/vacancy/${id}`);
    return await response.json();
};

const formatResultsData = (results = [], logos = []) =>
    results.map(result => formatVacancyData(result, logos));

const formatVacancyData = (vacancy = {}, logos = []) => {
    const salary = formatSalaryOutput(vacancy.salaryMin, vacancy.salaryMax);
    const closingDate = gdsDateFormat(vacancy.closingDate);

    // adding this as a temporary work around for checking existance of logo file
    // until future story implements CDN based file storage
    const logoFilename = `${ vacancy.department.id }.gif`;
    vacancy.department['hasLogo'] = doesDepartmentLogoExist(logoFilename, logos);

    return { ...vacancy, salary, closingDate };
};

const formatSalaryOutput = (min, max) => {
    if(min !== 0 && max !== 0) {
        return `${formatSalaryNumber(min)} - ${formatSalaryNumber(max)}`;
    }

    if(min === 0 && max === 0) {
        return null;
    }

    if(max === 0) {
        return formatSalaryNumber(min);
    }

    if(min === 0) {
        return formatSalaryNumber(max);
    }
};

const formatSalaryNumber = num => `£${num.toLocaleString()}`;

const generateReturnURL = queryStr => {
    if(!queryStr) return '/';

    const qs = queryStr.replace(/return_url=/, '');
    return `/results?${qs}`;
};

const isResultsPerPageValid = selected => {
    return RESULTS_PER_PAGE_OPTIONS.filter( item => item.value === selected).length;
};

const isRadiusValidOption = selected => {
    return LOCATION_RADIUS_OPTIONS.filter( item => item.value === selected).length;
}

module.exports = {
    fetchVacancyList,
    fetchVacancyDetails,
    formatResultsData,
    formatVacancyData,
    formatSalaryOutput,
    formatSalaryNumber,
    generateReturnURL,
    isResultsPerPageValid,
    isRadiusValidOption,
    RESULTS_PER_PAGE_OPTIONS,
    DEFAULT_RESULTS_PER_PAGE,
    LOCATION_RADIUS_OPTIONS,
    DEFAULT_LOCATION_RADIUS
};