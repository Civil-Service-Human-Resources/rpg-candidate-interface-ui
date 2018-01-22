const test = require('ava');
const { formatResultsData, formatSalaryOutput, formatSalaryNumber } = require('.');

test(`salary string less than 1000 is formatted with currency and no commas`, t => {
    const salary = formatSalaryNumber(999);
    const expected = "£999";

    t.deepEqual(salary, expected);
});

test(`salary string greater than 999 is formatted with currency and commas`, t => {
    const salary = formatSalaryNumber(1233);
    const expected = "£1,233";

    t.deepEqual(salary, expected);
});

test(`salary is returned as null if min and max not provided`, t => {
    const salary = formatSalaryOutput(0, 0);

    t.deepEqual(salary, null);
});

test(`salary string is formatted correctly (min & max populated)`, t => {
    const salary = formatSalaryOutput(50000, 80000);

    t.deepEqual(salary, "£50,000 - £80,000");
});

test(`salary string is formatted correctly (min populated, no max)`, t => {
    const salary = formatSalaryOutput(50000, 0);

    t.deepEqual(salary, "£50,000");
});

test(`salary string is formatted correctly (no min, max populated)`, t => {
    const salary = formatSalaryOutput(0, 80000);

    t.deepEqual(salary, "£80,000");
});

test(`results are returned in the correct format (no results)`, t => {
    const before = [];
    const expected = [];
    const actual = formatResultsData(before);

    t.deepEqual(actual, expected);
});

test(`results are returned in the correct format (results)`, t => {
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
            "closingDate": "﻿2018-05-08 00:00:00",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salaryMin": 50000,
            "salaryMax": 80000,
            "numberVacancies": 2,
            "department": {
                "id": 2,
                "name": "DWP"
            }
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
            "closingDate": "2018-05-08 00:00:00",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salaryMin": 80000,
            "salaryMax": 0,
            "numberVacancies": 2,
            "department": {
                "id": 6,
                "name": "DWP"
            }
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
            "closingDate": "8 May 2018",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salary": "£50,000 - £80,000",
            "salaryMin": 50000,
            "salaryMax": 80000,
            "numberVacancies": 2,
            "department": {
                "id": 2,
                "name": "DWP",
                "hasLogo": false
            }
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
            "closingDate": "8 May 2018",
            "contactName": "Joe Bloggs",
            "contactDepartment": "Some department",
            "contactEmail": "joe.bloggs@digital.hmrc.gov.uk",
            "contactTelephone": "01" +
            "234 567890",
            "eligibility": "Candidates in their probationary period are eligible to apply for vacancies within this department.",
            "salary": "£80,000",
            "salaryMin": 80000,
            "salaryMax": 0,
            "numberVacancies": 2,
            "department": {
                "id": 6,
                "name": "DWP",
                "hasLogo": false
            }
        }
    ];

    const actual = formatResultsData(before);

    t.deepEqual(actual, expected);
});