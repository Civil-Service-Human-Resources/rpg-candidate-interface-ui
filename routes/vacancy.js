const express = require('express');
const url = require('url');

const router = express.Router();

const { fetchVacancyDetails, generateReturnURL } = require('../lib/modules/vacancy');

/* GET vacancy details page. */
router.get('/details/:id', (req, res) => {
    const { id } = req.params;
    const queryString = url.parse(req.url).query;

    fetchVacancyDetails(id).then((vacancy) => {
        const returnUrl = generateReturnURL(queryString);

        return res.render('pages/vacancy/details', {
            vacancy,
            returnUrl,
        });
    });
});

module.exports = router;
