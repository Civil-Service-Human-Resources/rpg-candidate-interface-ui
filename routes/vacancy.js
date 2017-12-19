var express = require('express');
var router = express.Router();
var url = require('url');
var fetch = require('node-fetch');

const VIEW_PATH = 'pages/vacancy/details';

/* GET vacancy details page. */
router.get('/details/:id', function(req, res, next) {
    const vacancyId = req.params.id;
    const query_string = url.parse(req.url).query;

    try {
        fetchVacancyDetails(vacancyId).then(data => {
            res.render(VIEW_PATH, {
                page: { title: `${data.title} - Department Name` },
                vacancy: data,
                returnUrl: generateReturnURL(query_string)
            })
        });
        
    } catch(e) {
        // need to do unhappy path
    }
    
});

async function fetchVacancyDetails(id) {
    let response = await fetch(`http://localhost:8080/vacancy/${id}`);
    let data = await response.json();
    return data;
}

function generateReturnURL(queryStr) {
    if(!queryStr) return '/';

    const qs = queryStr.replace(/return_url=/, '');
    return `/results?${qs}`;
}

module.exports = router;