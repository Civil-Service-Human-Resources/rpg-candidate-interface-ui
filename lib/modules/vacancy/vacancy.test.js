const test = require('ava');
const { formatResultData, formatSalaryOutput, formatSalaryNumber } = require('.');

const TEST_SUITE = 'VACANCIES';

test(`${TEST_SUITE} - salary string less than 1000 is formatted with currency and no commas`, t => {
    const salary = formatSalaryNumber(999);
    const expected = "£999";

    t.deepEqual(salary, expected);
});

test(`${TEST_SUITE} - salary string greater than 999 is formatted with currency and commas`, t => {
    const salary = formatSalaryNumber(1233);
    const expected = "£1,233";

    t.deepEqual(salary, expected);
});

test(`${TEST_SUITE} - salary is returned as null if min and max not provided`, t => {
    const salary = formatSalaryOutput(0, 0);

    t.deepEqual(salary, null);
});

test(`${TEST_SUITE} - salary string is formatted correctly (min & max populated)`, t => {
    const salary = formatSalaryOutput(50000, 80000);

    t.deepEqual(salary, "£50,000 - £80,000");
});

test(`${TEST_SUITE} - salary string is formatted correctly (min populated, no max)`, t => {
    const salary = formatSalaryOutput(50000, 0);

    t.deepEqual(salary, "£50,000");
});

test(`${TEST_SUITE} - salary string is formatted correctly (no min, max populated)`, t => {
    const salary = formatSalaryOutput(0, 80000);

    t.deepEqual(salary, "£80,000");
});

test(`${TEST_SUITE} - results are returned in the correct format (no results)`, t => {
    const before = [];
    const expected = [];
    const actual = formatResultData(before);

    t.deepEqual(actual, expected);
});

test(`${TEST_SUITE} - results are returned in the correct format (results)`, t => {
    const before = [
        {
            "id": 381,
            "title": "Technical Architects / Senior Technical Architects",
            "description": "The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.",
            "location": "London",
            "grade": "Grade 7",
            "role": "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.",
            "responsibilities": "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.",
            "workingHours": "36/37",
            "closingDate": "10 Jan 2018",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salaryMin": 50000,
            "salaryMax": 80000,
            "numberVacancies": 2
        },
        {
            "id": 382,
            "title": "Technical Architects / Senior Technical Architects",
            "description": "The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.",
            "location": "London",
            "grade": "Grade 7",
            "role": "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.",
            "responsibilities": "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.",
            "workingHours": "36/37",
            "closingDate": "10 Jan 2018",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salaryMin": 80000,
            "salaryMax": 0,
            "numberVacancies": 2
        }
    ];

    const expected = [
        {
            "id": 381,
            "title": "Technical Architects / Senior Technical Architects",
            "description": "The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.",
            "location": "London",
            "grade": "Grade 7",
            "role": "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.",
            "responsibilities": "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.",
            "workingHours": "36/37",
            "closingDate": "10 Jan 2018",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salary": "£50,000 - £80,000",
            "salaryMin": 50000,
            "salaryMax": 80000,
            "numberVacancies": 2
        },
        {
            "id": 382,
            "title": "Technical Architects / Senior Technical Architects",
            "description": "The government is changing fast and you could be at the heart of this change. This is an exciting opportunity to help make the government better every day.",
            "location": "London",
            "grade": "Grade 7",
            "role": "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution.",
            "responsibilities": "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.",
            "workingHours": "36/37",
            "closingDate": "10 Jan 2018",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01" +
            "234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salary": "£80,000",
            "salaryMin": 80000,
            "salaryMax": 0,
            "numberVacancies": 2
        }
    ];

    const actual = formatResultData(before);

    t.deepEqual(actual, expected);
});