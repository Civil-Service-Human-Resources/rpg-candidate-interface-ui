const test = require('ava');
const {
    formatResultsData,
    formatSalaryOutput,
    formatSalaryNumber,
    parseRegionsList,
    generateReturnURL,
    generateDisabilityLogoInfo,
    getVacancyLocation,
    returnSalaryDetails,
    returnFormattedLocations,
    convertJpgToPng,
} = require('.');

test('return url property is removed from query string', (t) => {
    const returnUrl = generateReturnURL('return_url=keyword=Analyst&location=London&page=1');
    const expected = '/results?keyword=Analyst&location=London&page=1';

    t.deepEqual(returnUrl, expected);
});

test('regions returns null if not supplied', (t) => {
    const before = null;
    const after = false;

    t.deepEqual(parseRegionsList(before), after);
});


test('regions are parsed in the correct format', (t) => {
    const before = 'Cornwall,Somerset ,  Kent';
    const after = 'Cornwall, Somerset, Kent';

    t.deepEqual(parseRegionsList(before), after);
});

test('no disability logo is returned if not supplied', (t) => {
    const input = null;
    const output = null;

    t.deepEqual(generateDisabilityLogoInfo(input), output);
});

test('image path to disability leader and english is returned', (t) => {
    const input = 'leader';
    const output = {
        path: '/images/logos/disability-confidence/en/leader.png',
        alt: 'global.logos.disabilityConfidentLeader',
    };

    t.deepEqual(generateDisabilityLogoInfo(input, 'en'), output);
});

test('image path to disability committed and welsh is returned', (t) => {
    const input = 'committed';
    const output = {
        path: '/images/logos/disability-confidence/cy/committed.png',
        alt: 'global.logos.disabilityConfidentCommitted',
    };

    t.deepEqual(generateDisabilityLogoInfo(input, 'cy'), output);
});

test('salary string less than 1000 is formatted with currency and no commas', (t) => {
    const salary = formatSalaryNumber(999);
    const expected = '£999';

    t.deepEqual(salary, expected);
});

test('salary string greater than 999 is formatted with currency and commas', (t) => {
    const salary = formatSalaryNumber(1233);
    const expected = '£1,233';

    t.deepEqual(salary, expected);
});

test('salary is returned as Not specified if min and max not provided', (t) => {
    const salary = formatSalaryOutput(0, 0);

    t.deepEqual(salary, 'Not specified');
});

test('salary string is formatted correctly (min & max populated)', (t) => {
    const salary = formatSalaryOutput(50000, 80000);

    t.deepEqual(salary, '£50,000 - £80,000');
});

test('salary string is formatted correctly (min populated, no max)', (t) => {
    const salary = formatSalaryOutput(50000, 0);

    t.deepEqual(salary, '£50,000');
});

test('salary string is formatted correctly (no min, max populated)', (t) => {
    const salary = formatSalaryOutput(0, 80000);

    t.deepEqual(salary, '£80,000');
});

test('return overriden salary string if supplied', (t) => {
    const expected = 'We\'ll pay you a million dollar!';

    t.deepEqual(returnSalaryDetails(30000, 50000, 'We\'ll pay you a million dollar!'), expected);
});

test('show empty location string if empty location array is provided', (t) => {
    const input = [];
    const output = '';

    t.deepEqual(returnFormattedLocations(input), output);
});

test('show empty location string if empty location array is provided', (t) => {
    const input = [
        {
            'id': 1886,
            'longitude': -0.826419,
            'latitude': 51.823131,
            'location': 'Aylesbury',
        },
        {
            'id': 1887,
            'longitude': -1.468283,
            'latitude': 53.380103,
            'location': 'Sheffield',
        },
        {
            'id': 1888,
            'longitude': -1.523476,
            'latitude': 54.893693,
            'location': 'Washington',
        },
    ];
    const output = 'Aylesbury, Sheffield, Washington';

    t.deepEqual(returnFormattedLocations(input), output);
});

test('return overriden location string if supplied and not locations string', (t) => {
    const input = {
        'locationOverride': 'You\'ll work all over the place!',
        'overseasJob': true,
        'regions': 'Cornwall,Somerset ,  Kent',
        'vacancyLocations': [],
    };
    const output = 'You\'ll work all over the place!';

    t.deepEqual(getVacancyLocation(input), output);
});

test('return overseas job translation string if supplied and not locations string', (t) => {
    const input = {
        'locationOverride': null,
        'overseasJob': true,
        'regions': 'Cornwall,Somerset ,  Kent',
        'vacancyLocations': [],
    };
    const output = 'global.labels.overseas';

    t.deepEqual(getVacancyLocation(input), output);
});

test('return regions string if supplied and not locations string', (t) => {
    const input = {
        'locationOverride': null,
        'overseasJob': false,
        'regions': 'Cornwall,Somerset ,  Kent',
        'vacancyLocations': [],
    };
    const output = 'Cornwall,Somerset ,  Kent';

    t.deepEqual(getVacancyLocation(input), output);
});

test('return locations string if location override, overseas or regions are not supplied', (t) => {
    const input = {
        'locationOverride': null,
        'overseasJob': false,
        'regions': null,
        'vacancyLocations': [
            {
                'id': 1886,
                'longitude': -0.826419,
                'latitude': 51.823131,
                'location': 'Aylesbury',
            },
            {
                'id': 1887,
                'longitude': -1.468283,
                'latitude': 53.380103,
                'location': 'Sheffield',
            },
            {
                'id': 1888,
                'longitude': -1.523476,
                'latitude': 54.893693,
                'location': 'Washington',
            },
        ],
    };
    const output = 'Aylesbury, Sheffield, Washington';

    t.deepEqual(getVacancyLocation(input), output);
});

test('jpg converted to jpg', (t) => {
    const before = '128-Ofwat.jpg';
    const after = '128-Ofwat.png';

    t.deepEqual(after, convertJpgToPng(before));
});

test('results are returned in the correct format (no results)', (t) => {
    const before = [];
    const expected = [];
    const actual = formatResultsData(before);

    t.deepEqual(actual, expected);
});

test('results are returned in the correct format (results)', (t) => {
    const before = [
        {
            'id': 381,
            'title': 'Technical Architects / Senior Technical Architects',
            'description': 'The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.',
            'location': '',
            'grade': 'Grade 7',
            'role': 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.',
            'responsibilities': 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.',
            'workingHours': '36/37',
            'closingDate': '﻿2018-05-08 00:00:00',
            'contactName': 'Joe Bloggs',
            'contactDepartment': 'Some department',
            'contactEmail': 'joe.bloggs@digital.hmrc.gov.uk',
            'contactTelephone': '01234 567890',
            'eligibility': 'Candidates in their probationary period are eligible to apply for vacancies within this department.',
            'salaryMin': 50000,
            'salaryMax': 80000,
            'numberVacancies': 2,
            'department': {
                'id': 2,
                'name': 'DWP',
            },
        },
        {
            'id': 382,
            'title': 'Technical Architects / Senior Technical Architects',
            'description': 'The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.',
            'location': '',
            'grade': 'Grade 7',
            'role': 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.',
            'responsibilities': 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.',
            'workingHours': '36/37',
            'closingDate': '2018-05-08 00:00:00',
            'contactName': 'Joe Bloggs',
            'contactDepartment': 'Some department',
            'contactEmail': 'joe.bloggs@digital.hmrc.gov.uk',
            'contactTelephone': '01234 567890',
            'eligibility': 'Candidates in their probationary period are eligible to apply for vacancies within this department.',
            'salaryMin': 80000,
            'salaryMax': 0,
            'numberVacancies': 2,
            'department': {
                'id': 6,
                'name': 'DWP',
            },
        },
    ];

    const expected = [
        {
            'id': 381,
            'title': 'Technical Architects / Senior Technical Architects',
            'description': 'The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.',
            'location': '',
            'grade': 'Grade 7',
            'role': 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.',
            'responsibilities': 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.',
            'workingHours': '36/37',
            'closingDate': '8 May 2018',
            'contactName': 'Joe Bloggs',
            'contactDepartment': 'Some department',
            'contactEmail': 'joe.bloggs@digital.hmrc.gov.uk',
            'contactTelephone': '01234 567890',
            'eligibility': 'Candidates in their probationary period are eligible to apply for vacancies within this department.',
            'salary': '£50,000 - £80,000',
            'salaryMin': 50000,
            'salaryMax': 80000,
            'shortDescription': undefined,
            'showCscInfo': undefined,
            'numberVacancies': 2,
            'regions': false,
            'department': {
                'id': 2,
                'name': 'DWP',
                'disabilityLogo': null,
                'fullLogoPath': null,
            },
        },
        {
            'id': 382,
            'title': 'Technical Architects / Senior Technical Architects',
            'description': 'The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.',
            'location': '',
            'grade': 'Grade 7',
            'role': 'Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.',
            'responsibilities': 'Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.',
            'workingHours': '36/37',
            'closingDate': '8 May 2018',
            'contactName': 'Joe Bloggs',
            'contactDepartment': 'Some department',
            'contactEmail': 'joe.bloggs@digital.hmrc.gov.uk',
            'contactTelephone': '01' +
            '234 567890',
            'eligibility': 'Candidates in their probationary period are eligible to apply for vacancies within this department.',
            'salary': '£80,000',
            'salaryMin': 80000,
            'salaryMax': 0,
            'shortDescription': undefined,
            'showCscInfo': undefined,
            'numberVacancies': 2,
            'regions': false,
            'department': {
                'id': 6,
                'name': 'DWP',
                'disabilityLogo': null,
                'fullLogoPath': null,
            },
        },
    ];

    const actual = formatResultsData(before);

    t.deepEqual(actual, expected);
});
