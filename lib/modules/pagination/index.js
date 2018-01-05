
module.exports = (
    totalPages = 1,
    isFirst = true,
    isLast = false,
    totalItems = 0,
    numItemsOnCurrentPage,
    url = '',
    itemsPerPage = 20,
    currentPageNumber = 1
) => {

    const startItemNumber = calculateStartItemNumber(itemsPerPage, currentPageNumber);
    const endItemNumber = calculateLastItemNumber(itemsPerPage, numItemsOnCurrentPage, currentPageNumber);

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
        prevPage: currentPageNumber,
        currentPage: currentPageNumber + 1,
        nextPage: currentPageNumber + 2
    }

}

function calculateStartItemNumber( ipp, currentPage ) {
    return (currentPage * ipp) + 1;
}

function calculateLastItemNumber( ipp, itemsOnCurrentPage, currentPage ) {
    if(ipp > itemsOnCurrentPage) {
        return (currentPage * ipp) + itemsOnCurrentPage
    }

    return (currentPage * ipp) + ipp;
}