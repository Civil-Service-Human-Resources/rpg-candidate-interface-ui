const fetch = require('node-fetch');

const fetchDepartmentList = async () => {
    const url = `${process.env.API_URL}:${process.env.API_PORT}/department?size=1000`;
    const response = await fetch(url);
    const departmentData = await response.json();

    return departmentData.content;
};

module.exports = {
    fetchDepartmentList,
};
