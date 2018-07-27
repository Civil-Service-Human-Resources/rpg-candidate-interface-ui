const test = require('ava');
const { vacancyLdJson, homeLdJson } = require('.');

test('Home page LD json is created correctly', async (t) => {
    const expectedLD = {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        'url': `${process.env.APP_DOMAIN}`,
        'potentialAction': {
            '@type': 'SearchAction',
            'target': `${process.env.APP_DOMAIN}/results?keyword={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
    const homeJson = await homeLdJson();

    t.deepEqual(homeJson, expectedLD);
});

test('Vacancy detail LD json is created correctly', async (t) => {
    const expectedLD = {
        '@context': 'http://schema.org',
        '@type': 'JobPosting',
        'identifier': {
            '@type': 'PropertyValue',
            'name': 'Driver and Vehicle Licensing Agency',
            'value': '40-DVLA',
        },
        'hiringOrganization': {
            '@type': 'Organization',
            'name': 'Driver and Vehicle Licensing Agency',
            'url': 'dvla.com',
            'logo': '/images/logos/department/40-DVLA.png',
        },
        'baseSalary': {
            '@type': 'MonetaryAmount',
            'currency': 'GBP',
            'minValue': 30001,
            'maxValue': 60000,
        },
        'datePosted': '2018-05-02T23:00:00.000+0000',
        'validThrough': '2018-08-30T22:59:59.999+0000',
        'description': 'Join the DVLA',
        'employmentType': 'Permanent',
        'industry': 'Driver and Vehicle Licensing Agency',
        'jobLocation': {
            '@type': 'Place',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': null,
                'addressRegion': null,
                'postalCode': null,
                'streetAddress': null,
            },
        },
        'responsibilities': 'lots of things',
        'salaryCurrency': 'GBP',
        'title': 'Software Engineer (Lead & Senior Engineer Level) ',
        'workHours': '37',
        'experienceRequirements': 'personal spec',
    };
    const vacancy = {
        'id': 193,
        'identifier': 1583097,
        'title': 'Software Engineer (Lead & Senior Engineer Level) ',
        'description': 'Join the DVLA',
        'shortDescription': null,
        'grade': 'Grade 7, Senior Executive Officer',
        'responsibilities': 'lots of things',
        'workingHours': '37',
        'closingDate': '2018-08-30T22:59:59.999+0000',
        'contactName': '<a href=\'mailto:dvlacareers@experis.co.uk?Subject=DVLA%20vacancy\' target=\'_top\'>dvlacareers@experis.co.uk</a>',
        'contactDepartment': '',
        'contactEmail': '',
        'contactTelephone': '',
        'eligibility': 'Candidates in their probationary period are eligible to apply for vacancies within this department.',
        'governmentOpeningDate': '2018-05-02T23:00:00.000+0000',
        'internalOpeningDate': '2018-05-02T23:00:00.000+0000',
        'publicOpeningDate': '2018-05-02T23:00:00.000+0000',
        'salaryMin': 30001,
        'salaryMax': 60000,
        'numberVacancies': 15,
        'department': {
            'id': 40,
            'identifier': '40-DVLA',
            'name': 'Driver and Vehicle Licensing Agency',
            'disabilityLogo': null,
            'departmentStatus': null,
            'disabilityConfidenceLevel': null,
            'disabilityConfidenceLevelLastUpdate': '0001-01-01T00:01:15.000+0000',
            'logoNeeded': null,
            'logoPath': '/40-DVLA.png',
            'acceptedEmailExtensions': null,
            'fullLogoPath': '/images/logos/department/40-DVLA.png',
        },
        'atsVendorIdentifier': 'wcn_v9',
        'displayCscContent': false,
        'selectionProcessDetails': 'The Sift',
        'applyURL': 'dvla.com',
        'regions': null,
        'overseasJob': false,
        'nationalityStatement': 'NON_RESERVED',
        'vacancyLocations': [
            {
                'id': 953,
                'longitude': -3.938965,
                'latitude': 51.62691,
                'location': 'Swansea',
            },
            {
                'id': 952,
                'longitude': -2.585805,
                'latitude': 51.456492,
                'location': 'Bristol',
            },
        ],
        'salaryOverrideDescription': '£37,428 - £60,649 these roles may attract a DigiTec - allowance of up to £15k depending on skills and experience',
        'contractTypes': 'Permanent',
        'workingPatterns': 'Flexible working, Full-time, Job share, Part-time',
        'whatWeOffer': 'Besides the rewarding nature of the job itself',
        'locationOverride': 'Bristol, South West : Swansea, Wales',
        'personalSpecification': 'personal spec',
        'active': true,
        'lengthOfEmployment': null,
    };
    const vacancyJson = await vacancyLdJson(vacancy);

    t.deepEqual(vacancyJson, expectedLD);
});
