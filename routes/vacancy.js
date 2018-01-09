const express = require('express');
const router = express.Router();
const url = require('url');
const fetch = require('node-fetch');

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

async function fetchVacancyDetails(id) {
    let response = await fetch(`${process.env.API_URL}:${process.env.API_PORT}/vacancy/${id}`);
    return await response.json();
}

function generateReturnURL(queryStr) {
    if(!queryStr) return '/';

    const qs = queryStr.replace(/return_url=/, '');
    return `/results?${qs}`;
}

module.exports = router;