const express = require('express');
const router = express.Router();
const url = require('url');

const { fetchVacancyDetails, generateReturnURL } = require('../lib/modules/vacancy');
const { getDepartmentLogos, doesDepartmentLogoExist } = require('../lib/modules/department');

/* GET vacancy details page. */
router.get('/details/:id', function(req, res) {
    const { id } = req.params;
    const query_string = url.parse(req.url).query;
    const logos = getDepartmentLogos();

    try {
        fetchVacancyDetails(id).then(data => {
            data.department['hasLogo'] = doesDepartmentLogoExist(`${ data.department.id }.gif`, logos);

            res.render('pages/vacancy/details', {
                vacancy: data,
                returnUrl: generateReturnURL(query_string)
            })
        });
        
    } catch(e) {
        // need to do unhappy path
    }
    
});

module.exports = router;