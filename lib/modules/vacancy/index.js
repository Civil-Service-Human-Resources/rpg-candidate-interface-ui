const truncate = require('truncate-html');

const apiClient = require('../apiClient');
const { gdsDateFormat } = require('../date');

const { locale: CURRENT_LOCALE } = global;

const LOGO_FILEPATH = '/images/logos/department';

// some jobs are not department specific such as 'Cross departmental opportunities'
// add their id's here and the UI will output text only
const DEPT_WITHOUT_LOGOS = [22];

const SHORT_DESCRIPTION_MAX_LENGTH = 300;
const DEFAULT_RESULTS_PAGE_SIZE = '10';

const DEFAULT_RESULTS_PER_PAGE = '10';
const RESULTS_PER_PAGE_OPTIONS = [
    { value: '5', label: '5 per page' },
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
];

const DEFAULT_LOCATION_RADIUS = '30';
const LOCATION_RADIUS_OPTIONS = [
    { value: '5', label: '5 miles' },
    { value: '10', label: '10 miles' },
    { value: '15', label: '15 miles' },
    { value: '20', label: '20 miles' },
    { value: '30', label: '30 miles' },
    { value: '50', label: '50 miles' },
];

const MIN_SALARY_OPTIONS = [
    { value: '10000', label: '£10,000' },
    { value: '20000', label: '£20,000' },
    { value: '30000', label: '£30,000' },
    { value: '40000', label: '£40,000' },
    { value: '50000', label: '£50,000' },
    { value: '60000', label: '£60,000' },
    { value: '70000', label: '£70,000' },
    { value: '80000', label: '£80,000' },
    { value: '90000', label: '£90,000' },
    { value: '100000', label: '£100,000' },
];

const MAX_SALARY_OPTIONS = [
    { value: '10000', label: '£10,000' },
    { value: '20000', label: '£20,000' },
    { value: '30000', label: '£30,000' },
    { value: '40000', label: '£40,000' },
    { value: '50000', label: '£50,000' },
    { value: '60000', label: '£60,000' },
    { value: '70000', label: '£70,000' },
    { value: '80000', label: '£80,000' },
    { value: '90000', label: '£90,000' },
    { value: '100000', label: '£100,000' },
];

const generateReturnURL = (queryStr) => {
    if (!queryStr) return '/';

    const qs = queryStr.replace(/return_url=/, '');
    return `/results?${qs}`;
};

const isResultsPerPageValid = selected => RESULTS_PER_PAGE_OPTIONS.filter(item => item.value === selected).length;

const isRadiusValidOption = selected => LOCATION_RADIUS_OPTIONS.filter(item => item.value === selected).length;

const isMinSalaryValidOption = selected => MIN_SALARY_OPTIONS.filter(item => item.value === selected).length;

const isMaxSalaryValidOption = selected => MAX_SALARY_OPTIONS.filter(item => item.value === selected).length;

const fetchVacancyList = async function ({
    vacancySortMethod = 'CLOSING_DATE',
    location = null,
    keyword = null,
    depts = [],
    overseas = false,
    size = DEFAULT_RESULTS_PAGE_SIZE,
    radius = DEFAULT_LOCATION_RADIUS,
    minSalary = null,
    maxSalary = null,
    page = 0,
}, next = null) {
    const searchCriteria = {
        vacancySortMethod,
        keyword,
        maxSalary,
        minSalary,
        overseasJob: overseas,
        location: location ? {
            place: location,
            radius,
        } : null,
        department: typeof depts === 'string' ? [depts] : depts,
    };
    const { vacancies: { content, ...other }, vacancyErrors } = await apiClient.vacancy.search(size, page, searchCriteria, next);
    const vacancies = formatResultsData(content);
    return { vacancies, params: { ...other }, vacancyErrors };
};

const fetchVacancyDetails = async function (vendorid, id, next) {
    const data = await apiClient.vacancy.getById(vendorid, id, next);
    return formatVacancyData(data);
};

function formatVacancyData(vacancy = null) {
    const salary = returnSalaryDetails(vacancy.salaryMin, vacancy.salaryMax, vacancy.salaryOverrideDescription);
    const closingDate = gdsDateFormat(vacancy.closingDate);
    const showCscInfo = vacancy.displayCscContent && vacancy.publicOpeningDate;
    const disabilityLogo = vacancy.department && vacancy.department.disabilityConfidenceLevel
        ? generateDisabilityLogoInfo(vacancy.department.disabilityConfidenceLevel, CURRENT_LOCALE) : null;
    const shortDescription = truncate(vacancy.shortDescription, SHORT_DESCRIPTION_MAX_LENGTH, {
        stripTags: true,
    });
    const description = convertNlToBr(vacancy.description);
    const regions = parseRegionsList(vacancy.regions);
    const department = { ...vacancy.department };
    const location = getVacancyLocation(vacancy);

    return {
        ...vacancy,
        salary,
        closingDate,
        shortDescription,
        showCscInfo,
        regions,
        location,
        description,
        department: {
            ...department,
            disabilityLogo,
            fullLogoPath: !DEPT_WITHOUT_LOGOS.includes(department.id) && department.logoPath ? `${LOGO_FILEPATH}${convertJpgToPng(department.logoPath)}` : null,
        },
    };
}

function getVacancyLocation({
    locationOverride,
    overseasJob,
    regions,
    vacancyLocations,
}) {
    if (locationOverride) {
        return locationOverride;
    }

    if (overseasJob) {
        return translateString('global.labels.overseas');
    }

    if (regions) {
        return regions;
    }

    return returnFormattedLocations(vacancyLocations);
}

function returnFormattedLocations(locations = []) {
    return locations
        .map(item => item.location)
        .join(', ');
}

function returnSalaryDetails(salaryMin = null, salaryMax = null, overrideSalary = null) {
    if (overrideSalary) {
        return overrideSalary;
    }

    return formatSalaryOutput(salaryMin, salaryMax);
}

function formatResultsData(results = [], logos = []) {
    return results.map(result => formatVacancyData(result, logos));
}

function formatSalaryOutput(min, max) {
    if (!min && !max) {
        return 'Not specified';
    }

    if (min && max) {
        if (min !== max) {
            return `${formatSalaryNumber(min)} - ${formatSalaryNumber(max)}`;
        }
        return `${formatSalaryNumber(min)}`;
    }

    if (!max) {
        return formatSalaryNumber(min);
    }

    if (!min) {
        return formatSalaryNumber(max);
    }

    return false;
}

function formatSalaryNumber(num = 0) {
    return `£${num.toLocaleString()}`;
}

function generateDisabilityLogoInfo(level = null, locale = 'en') {
    if (!level) return null;

    let filename = '';
    let alt = '';

    switch (level.toLowerCase()) {
    case 'committed':
        filename = 'committed.png';
        alt = 'global.logos.disabilityConfidentCommitted';
        break;
    case 'employer':
        filename = 'employer.png';
        alt = 'global.logos.disabilityConfidentEmployer';
        break;
    case 'leader':
        filename = 'leader.png';
        alt = 'global.logos.disabilityConfidentLeader';
        break;
    default: return null;
    }

    return {
        path: `/images/logos/disability-confidence/${locale}/${filename}`.toLowerCase(),
        alt,
    };
}

function parseRegionsList(regions = null) {
    if (!regions) return false;

    return regions.split(/\s*,\s*/).join(', ');
}

function convertNlToBr(str = '') {
    return str.replace(new RegExp('\r?\n', 'g'), '<br />');
}

function translateString(str = '') {
    if (!CURRENT_LOCALE) return str;

    return __();
}

function convertJpgToPng(image) {
    return image.replace(/jpg/gi, 'png');
}

module.exports = {
    fetchVacancyList,
    fetchVacancyDetails,
    formatSalaryNumber,
    formatResultsData,
    formatSalaryOutput,
    generateReturnURL,
    generateDisabilityLogoInfo,
    getVacancyLocation,
    returnFormattedLocations,
    returnSalaryDetails,
    isResultsPerPageValid,
    isRadiusValidOption,
    isMinSalaryValidOption,
    isMaxSalaryValidOption,
    parseRegionsList,
    convertJpgToPng,
    RESULTS_PER_PAGE_OPTIONS,
    DEFAULT_RESULTS_PER_PAGE,
    LOCATION_RADIUS_OPTIONS,
    DEFAULT_LOCATION_RADIUS,
    MIN_SALARY_OPTIONS,
    MAX_SALARY_OPTIONS,
};
