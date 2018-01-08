const test = require('ava');
const pager = require('./');

const TEST_SUITE = 'PAGINATION';

test(`${TEST_SUITE} - pager data for one page of results`, t => {
    const pagerData = pager(1, true, true, 14, 14, '', 20, 0);
    const correctData = {
        showSummary: true,
        showPager: false,
        isFirstPage: true,
        isLastPage: true,
        totalPages: 1,
        totalItems: 14,
        numItemsOnCurrentPage: 14,
        url: '',
        startItemNumber: 1,
        endItemNumber: 14,
        prevPage: null,
        currentPage: 1,
        nextPage: null,
        pageArray: [1]
    };

    t.deepEqual(pagerData, correctData);
});

test(`${TEST_SUITE} - pager data for two page of results, current page is 1`, t => {
    const pagerData = pager(2, true, false, 27, 20, '', 20, 0);
    const correctData = {
        showSummary: true,
        showPager: true,
        isFirstPage: true,
        isLastPage: false,
        totalPages: 2,
        totalItems: 27,
        numItemsOnCurrentPage: 20,
        url: '',
        startItemNumber: 1,
        endItemNumber: 20,
        prevPage: null,
        currentPage: 1,
        nextPage: 2,
        pageArray: [1, 2]
    };

    t.deepEqual(pagerData, correctData);
});

test(`${TEST_SUITE} - pager data for two pages of results, current page is 2`, t => {
    const pagerData = pager(2, false, true, 27, 7, '', 20, 1);
    const correctData = {
        showSummary: true,
        showPager: true,
        isFirstPage: false,
        isLastPage: true,
        totalPages: 2,
        totalItems: 27,
        numItemsOnCurrentPage: 7,
        url: '',
        startItemNumber: 21,
        endItemNumber: 27,
        prevPage: 1,
        currentPage: 2,
        nextPage: null,
        pageArray: [1, 2]
    };

    t.deepEqual(pagerData, correctData);
});

test(`${TEST_SUITE} - pager data for seven pages of results, current page is 4`, t => {
    const pagerData = pager(7, false, false, 126, 20, '', 20, 3);
    const correctData = {
        showSummary: true,
        showPager: true,
        isFirstPage: false,
        isLastPage: false,
        totalPages: 7,
        totalItems: 126,
        numItemsOnCurrentPage: 20,
        url: '',
        startItemNumber: 61,
        endItemNumber: 80,
        prevPage: 3,
        currentPage: 4,
        nextPage: 5,
        pageArray: [2, 3, 4, 5, 6]
    };

    t.deepEqual(pagerData, correctData);
});

test(`${TEST_SUITE} - pager data for seven pages of results, current page is 6`, t => {
    const pagerData = pager(7, false, false, 126, 20, '', 20, 5);
    const correctData = {
        showSummary: true,
        showPager: true,
        isFirstPage: false,
        isLastPage: false,
        totalPages: 7,
        totalItems: 126,
        numItemsOnCurrentPage: 20,
        url: '',
        startItemNumber: 101,
        endItemNumber: 120,
        prevPage: 5,
        currentPage: 6,
        nextPage: 7,
        pageArray: [3, 4, 5, 6, 7]
    };

    t.deepEqual(pagerData, correctData);
});

test(`${TEST_SUITE} - pager data for seven pages of results, current page is 7`, t => {
    const pagerData = pager(7, false, false, 126, 6, '', 20, 6);
    const correctData = {
        showSummary: true,
        showPager: true,
        isFirstPage: false,
        isLastPage: false,
        totalPages: 7,
        totalItems: 126,
        numItemsOnCurrentPage: 6,
        url: '',
        startItemNumber: 121,
        endItemNumber: 126,
        prevPage: 6,
        currentPage: 7,
        nextPage: null,
        pageArray: [3, 4, 5, 6, 7]
    };

    t.deepEqual(pagerData, correctData);
});

test(`${TEST_SUITE} - if one page of results, pager should be hidden`, t => {
    const pagerData = pager(1, true, true, 14, 14, '', 20, 0);
    t.falsy(pagerData.showPager);
});

test(`${TEST_SUITE} - if more than one page of results, pager should be visible`, t => {
    const pagerData = pager(2, true, false, 27, 20, '', 20, 0);
    t.truthy(pagerData.showPager);
});