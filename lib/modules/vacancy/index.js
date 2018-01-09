const fetch = require('node-fetch');

const fetchVacancyList = async function(filters) {
    const { location = '', keyword = '', page = 0 } = filters;
    const url = `${ process.env.API_URL }:${process.env.API_PORT}/vacancy/search/location/${location}/keyword/${keyword}?page=${page-1}`;

    let response = await fetch(url);
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

module.exports = {
    fetchVacancyList,
    formatResultData,
    formatSalaryOutput,
    formatSalaryNumber
};