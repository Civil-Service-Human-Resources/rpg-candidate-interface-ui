const createCrest = (code, colour, type) => {
    const crest = {
        id: code,
        color: colour,
        logo: null,
        size: null,
        padding: null,
    };

    switch (type) {
    case 'modCrest':
        crest.logo = '/images/icons/govuk/mod_crest_27px_x2.png';
        crest.size = '40px';
        crest.padding = '65px';
        break;
    case 'ukhoCrest':
        crest.logo = '/images/icons/govuk/ukho_27px_x2.png';
        crest.size = '35px';
        crest.padding = '60px';
        break;
    case 'hoCrest':
        crest.logo = '/images/icons/govuk/ho_crest_27px_x2.png';
        crest.size = '25px';
        crest.padding = '55px';
        break;
    case 'hmrcCrest':
        crest.logo = '/images/icons/govuk/hmrc_crest_27px_x2.png';
        crest.size = '40px';
        crest.padding = '45px';
        break;
    case 'govCrest':
        crest.logo = '/images/icons/govuk/govuk-crest-black-2x.png';
        crest.size = '40px';
        crest.padding = '40px';
        break;
    case 'ditCrest':
        crest.logo = '/images/icons/govuk/dit_crest_27px_x2.png';
        crest.size = '40px';
        crest.padding = '50px';
        break;
    case 'soCrest':
        crest.logo = '/images/icons/govuk/so_crest_27px_x2.png';
        crest.size = '40px';
        crest.padding = '40px';
        break;
    default:
        crest.logo = '/images/icons/govuk/govuk-crest-black-2x.png';
        crest.size = '40px';
        crest.padding = '40px';
    }

    return crest;
};

const crests = [
    createCrest('7-CO', '#005abb', 'govCrest'),
    createCrest('23-CCS', '#0076c0', 'soCrest'),
    createCrest('28-BEIS', '#005abb', 'govCrest'),
    createCrest('33-DfID', '#002878', 'govCrest'),
    createCrest('36-DWP', '#00beb7', 'govCrest'),
    createCrest('40-DVLA', '#006c56', 'govCrest'),
    createCrest('41-DVSA', '#006c56', 'govCrest'),
    createCrest('46-EHRC', '#0076c0', 'govCrest'),
    createCrest('56-GCF', '#0076c0', 'govCrest'),
    createCrest('59-GDS', '#005abb', 'govCrest'),
    createCrest('60-GIAA', '#005abb', 'govCrest'),
    createCrest('61-GLD', '#9f1888', 'govCrest'),
    createCrest('73-HMCTS', '#000', 'govCrest'),
    createCrest('76-HMP&PS', '#000', 'govCrest'),
    createCrest('77-HMRC', '#009390', 'hmrcCrest'),
    createCrest('79-HO', '#9325b2', 'hoCrest'),
    createCrest('54-GLAA', '#9325b2', 'hoCrest'),
    createCrest('80-HE', '#000', 'govCrest'),
    createCrest('81-HoC', '#317023', 'govCrest'),
    createCrest('102-MHPRA', '#00beb7', 'govCrest'),
    createCrest('105-MoD', '#4d2942', 'modCrest'),
    createCrest('106-MHCLG', '#00857e', 'govCrest'),
    createCrest('107-MoJ', '#231f20', 'govCrest'),
    createCrest('111-NIC', '#9c132e', 'govCrest'),
    createCrest('136-PHE', '#00beb7', 'govCrest'),
    createCrest('163-UKHO', '#000', 'ukhoCrest'),
    createCrest('39-DBS', '#0076c0', 'govCrest'),
    createCrest('39-DCMS', '#ec1292', 'govCrest'),
    createCrest('100-MCA', '#238a84', 'govCrest'),
    createCrest('135-PI', '#238a84', 'govCrest'),
    createCrest('161-UKEF', '#005747', 'ditCrest'),
    createCrest('32-DEXEU', '#009fe3', 'govCrest'),
    createCrest('34-DfIT', '#CF102D', 'ditCrest'),
    createCrest('31-DEFRA', '#8b8d09', 'govCrest'),
    createCrest('30-DfE', '#005288', 'govCrest'),
    createCrest('35-DfT', '#007161', 'govCrest'),
    createCrest('2-APHA', '#01a33b', 'govCrest'),
    createCrest('35-DfT', '#007161', 'govCrest'),
    createCrest('92-IS', '#0b3b7a', 'govCrest'),
    createCrest('38-DoH', '#01af9f', 'govCrest'),
    createCrest('78-HMT', '#af292e', 'govCrest'),
    createCrest('50-50-FCO', '#00467f', 'govCrest'),
    createCrest('127-OPG', '#000', 'govCrest'),
    createCrest('162-UKGI', '#af292e', 'govCrest'),
    createCrest('160-UKDMO', '#af292e', 'govCrest')];

const isCrestLogo = (vacancy) => {
    let found = false;
    crests.forEach((item) => {
        if (item.id === vacancy.department.identifier) {
            found = true;
        }
    });
    return found;
};

const crestInformation = (vacancy) => {
    let found = {};
    crests.forEach((item, i) => {
        if (item.id === vacancy.department.identifier) {
            found = crests[i];
        }
    });
    return found;
};

module.exports = {
    isCrestLogo,
    crestInformation,
};
