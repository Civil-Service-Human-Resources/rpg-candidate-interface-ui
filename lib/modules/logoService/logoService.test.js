const test = require('ava');
const { isCrestLogo, crestInformation } = require('.');

const vacancy = {
    'id': 1110,
    'identifier': 1595217,
    'title': 'HEO Investigator, Bristol   Official Receiver Services & Investigation and Enforcement Services',
    'department': {
        'id': 92,
        'identifier': '7-CO',
        'name': 'Insolvency Service',
        'disabilityLogo': null,
        'departmentStatus': 'ACTIVE',
        'disabilityConfidenceLevel': null,
        'disabilityConfidenceLevelLastUpdate': '2018-02-02T00:00:00.000+0000',
        'logoNeeded': false,
        'logoPath': '/92-IS.png',
        'parent': null,
    },
};

test('Correctly detects a crest based logo', async (t) => {
    t.deepEqual(isCrestLogo(vacancy), true);
});


test('Correctly returns logo information', async (t) => {
    const expectedResponse = {
        id: '7-CO',
        logo: '/images/icons/govuk/govuk-crest-black-2x.png',
        size: '40px',
        padding: '40px',
        color: '#005abb',
    };

    t.deepEqual(crestInformation(vacancy), expectedResponse);
});
