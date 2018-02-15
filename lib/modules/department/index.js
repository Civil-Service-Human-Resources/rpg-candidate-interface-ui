const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const fetchDepartmentList = async () => {
    const url = `${process.env.API_URL}:${process.env.API_PORT}/department`;
    const response = await fetch(url);
    const departmentData = await response.json();

    return departmentData.content;
};

const getDepartmentLogos = () => {
    const imagePath = path.resolve('public/images/logos/department');
    return fs.readdirSync(imagePath, (err, files) => files);
};

const doesDepartmentLogoExist = (filename = '', logos = []) => logos.includes(filename);

module.exports = {
    fetchDepartmentList,
    getDepartmentLogos,
    doesDepartmentLogoExist,
};
