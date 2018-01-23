const fetch = require('node-fetch');
const moment = require('moment');
const { doesDepartmentLogoExist } = require('../department');
const { gdsDateFormat } = require('../date');

const fetchVacancyList = async function({ location = '', keyword = '', depts = [], page = 0 }) {

    const url = `${ process.env.API_URL }:${process.env.API_PORT}/vacancy/search?page=${page-1}`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          keyword,
          location,
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

module.exports = {
    fetchVacancyList,
    fetchVacancyDetails,
    formatResultsData,
    formatVacancyData,
    formatSalaryOutput,
    formatSalaryNumber,
    generateReturnURL
};