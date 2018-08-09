const sm = require('sitemap');
const apiClient = require('../apiClient');
const logger = require('../logger');

const siteMap = sm.createSitemap({
    hostname: `${process.env.APP_DOMAIN}`,
    cacheTime: 6000000, // 6000 sec cache period
});

let jobIdAry = [];
const staticPages = [
    {
        url: '/',
        lastmodISO: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.2,
    },
    {
        url: '/internal-jobs',
        lastmodISO: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.2,
    },
    {
        url: '/cookies',
        lastmodISO: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.2,
    },
    {
        url: '/privacy-notice',
        lastmodISO: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.2,
    },
    {
        url: '/results',
        lastmodISO: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.2,
    },
    {
        url: '/terms-conditions',
        lastmodISO: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.2,
    },
];

const siteMapSet = (options) => {
    siteMap.add(options);
};

const siteMapGet = () => siteMap.toString();

const buildVacancySiteMap = () => {
    siteMap.urls = [];
    siteMap.cache = null;

    async function statics() {
        return staticPages.map(page => siteMapSet(page));
    }

    async function dynamicJobs() {
        jobIdAry = [];
        const { vacancies } = await apiClient.vacancy.getMeta();
        return vacancies.map((vacancy) => {
            jobIdAry.push({ 'id': vacancy.identifier, 'lastMod': vacancy.lastModified });
            return jobIdAry;
        });
    }

    statics().then(() => {
        dynamicJobs().then(() => {
            jobIdAry.map(vacancy => siteMapSet({
                url: `/job/details/${vacancy.id}`,
                lastmodISO: vacancy.lastMod,
                changefreq: 'daily',
                priority: 0.8,
            }));
        }).catch((err) => {
            logger.error(err);
        });
    });
};

module.exports = {
    siteMapGet,
    buildVacancySiteMap,
};
