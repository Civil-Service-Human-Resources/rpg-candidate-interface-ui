const vacancyLdJson = async function (vacancy) {
    return {
        '@context': 'http://schema.org',
        '@type': 'JobPosting',
        'identifier': {
            '@type': 'PropertyValue',
            'name': vacancy.department.name ? vacancy.department.name : null,
            'value': vacancy.department.identifier ? vacancy.department.identifier : null,
        },
        'hiringOrganization': {
            '@type': 'Organization',
            'name': vacancy.department.name ? vacancy.department.name : null,
            'url': vacancy.applyURL ? vacancy.applyURL : null,
            'logo': vacancy.department.fullLogoPath ? vacancy.department.fullLogoPath : null,
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
};

const homeLdJson = async function () {
    return {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        'url': `${process.env.APP_DOMAIN}`,
        'potentialAction': {
            '@type': 'SearchAction',
            'target': `${process.env.APP_DOMAIN}/results?keyword={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
};

module.exports = {
    vacancyLdJson,
    homeLdJson,
};
