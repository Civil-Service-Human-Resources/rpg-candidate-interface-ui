const fetch = require('node-fetch');
const { doesDepartmentLogoExist } = require('../department');
const { gdsDateFormat } = require('../date');

const DEFAULT_RESULTS_PER_PAGE = '10';
const RESULTS_PER_PAGE_OPTIONS = [
    { value: '5', label: '5 per page' },
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
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

const MIN_SALARY_OPTIONS = [
    { value: '10000', label: '£10,000' },
    { value: '20000', label: '£20,000' },
    { value: '30000', label: '£30,000' },
    { value: '40000', label: '£40,000' },
    { value: '50000', label: '£50,000' },
    { value: '60000', label: '£60,000' },
    { value: '70000', label: '£70,000' },
    { value: '80000', label: '£80,000' },
    { value: '90000', label: '£90,000' },
    { value: '100000', label: '£100,000' },
];

const MAX_SALARY_OPTIONS = [
    { value: '10000', label: '£10,000' },
    { value: '20000', label: '£20,000' },
    { value: '30000', label: '£30,000' },
    { value: '40000', label: '£40,000' },
    { value: '50000', label: '£50,000' },
    { value: '60000', label: '£60,000' },
    { value: '70000', label: '£70,000' },
    { value: '80000', label: '£80,000' },
    { value: '90000', label: '£90,000' },
    { value: '100000', label: '£100,000' },
];

const fetchVacancyList = async function ({
    location = '',
    keyword = '',
    depts = [],
    size = '10',
    radius = DEFAULT_LOCATION_RADIUS,
    minSalary = '',
    maxSalary = '',
    page = 0,
}) {
    const url = `${process.env.API_URL}:${process.env.API_PORT}/vacancy/search?size=${size}&page=${page - 1}`;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            keyword,
            maxSalary,
            minSalary,
            location: {
                place: location,
                radius,
            },
            department: typeof depts === 'string' ? [depts] : depts,
        }),
    };

    try {
        return await fetch(url, options).then(response => response.json());
    } catch (e) {
        // needs error logging
        return null;
    }
};

const fetchVacancyDetails = async function (id) {
    const response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}/vacancy/${id}`);
    const data = await response.json();

    return data;
};

const formatSalaryNumber = num => `£${num.toLocaleString()}`;

const formatSalaryOutput = (min, max) => {
    if (min !== 0 && max !== 0) {
        return `${formatSalaryNumber(min)} - ${formatSalaryNumber(max)}`;
    }

    if (min === 0 && max === 0) {
        return null;
    }

    if (max === 0) {
        return formatSalaryNumber(min);
    }

    if (min === 0) {
        return formatSalaryNumber(max);
    }

    return false;
};

const formatVacancyData = (vacancy = {}, logos = []) => {
    const salary = formatSalaryOutput(vacancy.salaryMin, vacancy.salaryMax);
    const closingDate = gdsDateFormat(vacancy.closingDate);

    // adding this as a temporary work around for checking existance of logo file
    // until future story implements CDN based file storage
    const logoFilename = `${vacancy.department.id}.gif`;
    const department = { ...vacancy.department };

    return {
        ...vacancy,
        salary,
        closingDate,
        department: {
            ...department,
            hasLogo: doesDepartmentLogoExist(logoFilename, logos),
        },
    };
};

const formatResultsData = (results = [], logos = []) =>
    results.map(result => formatVacancyData(result, logos));

const generateReturnURL = (queryStr) => {
    if (!queryStr) return '/';

    const qs = queryStr.replace(/return_url=/, '');
    return `/results?${qs}`;
};

const isResultsPerPageValid = selected =>
    RESULTS_PER_PAGE_OPTIONS.filter(item => item.value === selected).length;

const isRadiusValidOption = selected =>
    LOCATION_RADIUS_OPTIONS.filter(item => item.value === selected).length;

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
    DEFAULT_LOCATION_RADIUS,
    MIN_SALARY_OPTIONS,
    MAX_SALARY_OPTIONS,
};
