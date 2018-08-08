const sm = require('sitemap');
const apiClient = require('../apiClient');
const logger = require('../logger');

const siteMap = sm.createSitemap({
    hostname: `${process.env.APP_DOMAIN}`,
    cacheTime: 6000000, // 6000 sec cache period
});

let jobIdAry = [];

const siteMapSet = (options) => {
    siteMap.add(options);
};

const siteMapGet = () => siteMap.toString();

const deleteExistingUrlsFromSiteMap = new Promise((resolve) => {
    jobIdAry.map(vacancy => siteMap.del(`/job/details/${vacancy.id}`));
    resolve(true);
});

const buildVacancySiteMap = () => {
    async function getSiteMapData() {
        jobIdAry = [];
        const { vacancies } = await apiClient.vacancy.getMeta();
        return vacancies.map((vacancy) => {
            jobIdAry.push({ 'id': vacancy.identifier, 'lastMod': vacancy.lastModified });
            return jobIdAry;
        });
    }

    deleteExistingUrlsFromSiteMap.then(() => {
        getSiteMapData().then(() => {
            // console.log(jobIdAry);
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
    siteMapSet,
    siteMapGet,
    buildVacancySiteMap,
};
