const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const fetchDepartmentList = async function() {
    const url = `${ process.env.API_URL }:${process.env.API_PORT}/department`;

    try {
        return await fetch(url).then(response => response.json());
    } catch(e) {
        // logging needed here
        return null;
    }
};

const getDepartmentLogos = () => {
    const imagePath = path.resolve('public/images/logos/department');
    return fs.readdirSync(imagePath, (err, files) => files);
};

const doesDepartmentLogoExist = (filename = '', logos = []) => logos.includes(filename);

module.exports = {
    fetchDepartmentList,
    getDepartmentLogos,
    doesDepartmentLogoExist
};