// CONSTANTS / DEFAULTS
const TOTAL_PAGES = 1;
const TOTAL_ITEMS = 0;
const IS_FIRST_PAGE = true;
const IS_LAST_PAGE = false;
const TOTAL_ITEMS_ON_CURRENT_PAGE = 0;
const CURRENT_PAGE = 1;
const ITEMS_PER_PAGE = 20;

module.exports = (
    totalPages = TOTAL_PAGES,
    isFirst = IS_FIRST_PAGE,
    isLast = IS_LAST_PAGE,
    totalItems = TOTAL_ITEMS,
    numItemsOnCurrentPage = TOTAL_ITEMS_ON_CURRENT_PAGE,
    url = '',
    itemsPerPage = ITEMS_PER_PAGE,
    currentPageNumber = CURRENT_PAGE
) => {

    const currentPage = currentPageNumber + 1; // undo zero-based index
    const startItemNumber = calculateStartItemNumber(itemsPerPage, currentPage);
    const endItemNumber = calculateLastItemNumber(itemsPerPage, numItemsOnCurrentPage, currentPage);
    const pageArray = generatePageList(totalPages, currentPage);

    return {
        showSummary: true,
        showPager: totalPages !== 1,
        isFirstPage: isFirst,
        isLastPage: isLast,
        totalPages,
        totalItems,
        numItemsOnCurrentPage,
        url,
        startItemNumber,
        endItemNumber,
        prevPage: currentPage !== 1 ? currentPage - 1 : null,
        currentPage,
        nextPage: currentPage !== totalPages ? currentPage + 1 : null,
        pageArray: pageArray
    }

};

function generatePageList( totalPages, currentPage ) {

    // if there are less than 5 pages we don't want to show 5 items
    if(totalPages < 5) {
        return generatePageArray(1, totalPages);
    }

    // if we're on the first or second page, we want to show next 4 or 3
    if(currentPage === 1 || currentPage === 2) {
        return generatePageArray(1, 5);
    }

    // if we're on last or second to last page, we want to show previous 4 or 3
    if(currentPage === totalPages || currentPage === totalPages - 1) {
        return generatePageArray(totalPages - 4, totalPages);
    }

    // otherwise we're on a page somewhere in the middle, show 2 pages either side of current
    return generatePageArray(currentPage - 2, currentPage + 2);
}

function generatePageArray( start, finish ) {
    let arr = [];
    for(let i = start; i <= finish; i++) {
        arr.push(i);
    }
    return arr;
}

function calculateStartItemNumber( ipp, currentPage ) {
    return (currentPage * ipp) - ipp + 1;
}

function calculateLastItemNumber( ipp, itemsOnCurrentPage, currentPage ) { 
    return (currentPage * ipp) - ipp + itemsOnCurrentPage;
}