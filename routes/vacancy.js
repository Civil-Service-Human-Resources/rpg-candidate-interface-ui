const express = require('express');
const url = require('url');

const router = express.Router();

const { fetchVacancyDetails, generateReturnURL } = require('../lib/modules/vacancy');

/* GET vacancy details page. */
router.get('/details/:id', async (req, res, next) => {
    const { id } = req.params;
    const queryString = url.parse(req.url).query;
    const returnUrl = generateReturnURL(queryString);
    const vacancy = await fetchVacancyDetails(id, next);

    // TODO: all these data points will have to be added if node is available

    const ldJson = {
        '@context': 'http://schema.org',
        '@type': 'JobPosting',
        'hiringOrganization': {
            '@type': 'Organization',
            'name': vacancy.department.name ? vacancy.department.name : null,
            'url': vacancy.applyURL ? vacancy.applyURL : null,
            'logo': vacancy.department.logoPath ? vacancy.department.logoPath : null,
            'contactPoint': [
                {
                    '@type': 'ContactPoint',
                    'telephone': vacancy.contactTelephone ? vacancy.contactTelephone : null,
                    'contactType': vacancy.contactDepartment ? vacancy.contactDepartment : null,
                    'contactOption': 'local',
                    'areaServed': 'UK',
                },
            ],
        },
        'baseSalary': {
            '@type': 'MonetaryAmount',
            'currency': 'GBP',
            'minValue': vacancy.salaryMin ? vacancy.salaryMin : null,
            'maxValue': vacancy.salaryMax ? vacancy.salaryMax : null,
        },
        'datePosted': vacancy.publicOpeningDate ? vacancy.publicOpeningDate : null,
        'validThrough': vacancy.closingDate ? vacancy.closingDate : null,
        'description': vacancy.description ? vacancy.description : null,
        'employmentType': vacancy.contractTypes ? vacancy.contractTypes : null,
        'industry': vacancy.department.name ? vacancy.department.name : null,
        'jobLocation': {
            '@type': 'Place',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': vacancy.location ? vacancy.location : null,
                'addressRegion': vacancy.regions ? vacancy.regions : null,
                'postalCode': vacancy.postalCode ? vacancy.postalCode : null,
                'streetAddress': vacancy.streetAddress ? vacancy.streetAddress : null,
            },
        },
        'responsibilities': vacancy.responsibilities ? vacancy.responsibilities : null,
        'salaryCurrency': 'GBP',
        'title': vacancy.title ? vacancy.title : null,
        'workHours': vacancy.workingHours ? vacancy.workingHours : null,
    };

    return res.render('pages/vacancy/details', {
        title: vacancy.title,
        vacancy,
        returnUrl,
        ldJson,
    });
});

module.exports = router;
