const express = require('express');
const router = express.Router();
const url = require('url');

const { fetchVacancyDetails, generateReturnURL } = require('../lib/modules/vacancy');

/* GET vacancy details page. */
router.get('/details/:id', function(req, res) {
    const { id } = req.params;
    const query_string = url.parse(req.url).query;

    try {
        fetchVacancyDetails(id).then(data => {
            res.render('pages/vacancy/details', {
                i18n: {
                    ...req.translations,
                    title: data.title
                },
                vacancy: data,
                returnUrl: generateReturnURL(query_string)
            })
        });
        
    } catch(e) {
        // need to do unhappy path
    }
    
});

module.exports = router;