const express = require('express');
const url = require('url');
const { isCrestLogo, crestInformation } = require('../lib/modules/logoService');

const router = express.Router();
const { vacancyLdJson } = require('../lib/modules/ldJson');
const { fetchVacancyDetails, generateReturnURL } = require('../lib/modules/vacancy');

/* GET vacancy details page. */
router.get('/details/:id', async (req, res, next) => {
    const { id } = req.params;
    const queryString = url.parse(req.url).query;
    const returnUrl = generateReturnURL(queryString);
    const vacancy = await fetchVacancyDetails(id, next);
    const vacancyJson = await vacancyLdJson(vacancy);
    const newVacancy = vacancy;

    newVacancy.crestLogo = isCrestLogo(vacancy);
    if (isCrestLogo(vacancy)) {
        newVacancy.crestInformation = crestInformation(vacancy);
    }

    return res.render('pages/vacancy/details', {
        title: vacancy.title,
        vacancy,
        returnUrl,
        vacancyJson,
    });
});

module.exports = router;
