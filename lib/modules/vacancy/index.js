const fetch = require('node-fetch');

const fetchVacancyList = async function(filters) {
    const { location = '', keyword = '', depts = [], page = 0 } = filters;
    const keywordString = keyword ? `/keyword/${keyword}` : '';
    const url = `${ process.env.API_URL }:${process.env.API_PORT}/vacancy/search/location/${location}${keywordString}?page=${page-1}`;

    let response = await fetch(url);
    return await response.json();
};

const fetchVacancyDetails = async function(id) {
    let response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}/vacancy/${id}`);
    return await response.json();
};

const formatResultData = (results = []) =>
    results.map(result => {
        const salary = formatSalaryOutput(result.salaryMin, result.salaryMax);
        return { ...result, salary }
    });

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

module.exports = {
    fetchVacancyList,
    fetchVacancyDetails,
    formatResultData,
    formatSalaryOutput,
    formatSalaryNumber,
    generateReturnURL
};