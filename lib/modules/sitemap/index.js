const sm = require('sitemap');

const siteMap = sm.createSitemap({
    hostname: `${process.env.APP_DOMAIN}`,
    cacheTime: 6000000, // 6000 sec cache period
});

const siteMapSet = (options) => {
    siteMap.add(options);
};

const siteMapGet = () => siteMap.toString();

module.exports = {
    siteMapSet,
    siteMapGet,
};
