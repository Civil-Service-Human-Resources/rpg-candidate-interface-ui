const fetch = require('node-fetch');

const fetchDepartmentList = async function() {
    const url = `${ process.env.API_URL }:${process.env.API_PORT}/department`;

    try {
        return await fetch(url).then(response => response.json());
    } catch(e) {
        // logging needed here
        return null;
    }
};

module.exports = {
    fetchDepartmentList
};