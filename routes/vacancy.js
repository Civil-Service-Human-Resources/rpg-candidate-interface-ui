const express = require('express');
const url = require('url');

const router = express.Router();

const { fetchVacancyDetails, generateReturnURL, formatVacancyData } = require('../lib/modules/vacancy');
const { getDepartmentLogos } = require('../lib/modules/department');

/* GET vacancy details page. */
router.get('/details/:id', (req, res) => {
    const { id } = req.params;
    const queryString = url.parse(req.url).query;
    const logos = getDepartmentLogos();

    try {
        fetchVacancyDetails(id).then((data) => {
            const vacancy = formatVacancyData(data, logos);
            const returnUrl = generateReturnURL(queryString);
            const showCscInfo = vacancy.displayCscContent && vacancy.publicOpeningDate;

            return res.render('pages/vacancy/details', {
                vacancy,
                returnUrl,
                showCscInfo,
            });
        });
    } catch (e) {
        // need to do unhappy path
    }
});

module.exports = router;
