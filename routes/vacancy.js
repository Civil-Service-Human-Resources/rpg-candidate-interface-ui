const express = require('express');
const router = express.Router();
const url = require('url');

const { fetchVacancyDetails, generateReturnURL } = require('../lib/modules/vacancy');

const VIEW_PATH = 'pages/vacancy/details';

/* GET vacancy details page. */
router.get('/details/:id', function(req, res) {
    const vacancyId = req.params.id;
    const query_string = url.parse(req.url).query;

    try {
        fetchVacancyDetails(vacancyId).then(data => {
            res.render(VIEW_PATH, {
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