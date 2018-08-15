const soCrest = (code, colour) => ({
    id: code,
    logo: '/images/icons/govuk/so_crest_27px_x2.png',
    size: '40px',
    padding: '40px',
    color: colour,
});

const ditCrest = (code, colour) => ({
    id: code,
    logo: '/images/icons/govuk/dit_crest_27px_x2.png',
    size: '40px',
    padding: '50px',
    color: colour,
});

const govCrest = (code, colour) => ({
    id: code,
    logo: '/images/icons/govuk/govuk-crest-black-2x.png',
    size: '40px',
    padding: '40px',
    color: colour,
});

const hmrcCrest = (code, colour) => ({
    id: code,
    logo: '/images/icons/govuk/hmrc_crest_27px_x2.png',
    size: '40px',
    padding: '45px',
    color: colour,
});

const hoCrest = (code, colour) => ({
    id: code,
    logo: '/images/icons/govuk/ho_crest_27px_x2.png',
    size: '25px',
    padding: '55px',
    color: colour,
});

const modCrest = (code, colour) => ({
    id: code,
    logo: '/images/icons/govuk/mod_crest_27px_x2.png',
    size: '40px',
    padding: '65px',
    color: colour,
});

const ukhoCrest = (code, colour) => ({
    id: code,
    logo: '/images/icons/govuk/ukho_27px_x2.png',
    size: '35px',
    padding: '60px',
    color: colour,
});

const crestIds = [
    govCrest('7-CO', '#005abb'),
    soCrest('23-CCS', '#0076c0'),
    govCrest('28-BEIS', '#005abb'),
    govCrest('33-DfID', '#002878'),
    govCrest('36-DWP', '#00beb7'),
    govCrest('40-DVLA', '#006c56'),
    govCrest('41-DVSA', '#006c56'),
    govCrest('46-EHRC', '#0076c0'),
    govCrest('56-GCF', '#0076c0'),
    govCrest('59-GDS', '#005abb'),
    govCrest('60-GIAA', '#005abb'),
    govCrest('61-GLD', '#9f1888'),
    govCrest('73-HMCTS', '#000'),
    govCrest('76-HMP&PS', '#000'),
    hmrcCrest('77-HMRC', '#009390'),
    hoCrest('79-HO', '#9325b2'),
    hoCrest('54-GLAA', '#9325b2'),
    govCrest('80-HE', '#000'),
    govCrest('81-HoC', '#317023'),
    govCrest('102-MHPRA', '#00beb7'),
    modCrest('105-MoD', '#4d2942'),
    govCrest('106-MHCLG', '#00857e'),
    govCrest('107-MoJ', '#231f20'),
    govCrest('111-NIC', '#9c132e'),
    govCrest('136-PHE', '#00beb7'),
    ukhoCrest('163-UKHO', '#000'),
    govCrest('39-DBS', '#0076c0'),
    govCrest('39-DCMS', '#ec1292'),
    govCrest('100-MCA', '#238a84'),
    govCrest('135-PI', '#238a84'),
    ditCrest('161-UKEF', '#005747'),
    govCrest('32-DEXEU', '#009fe3'),
    ditCrest('34-DfIT', '#CF102D'),
    govCrest('31-DEFRA', '#8b8d09'),
    govCrest('30-DfE', '#005288'),
    govCrest('35-DfT', '#007161'),
    govCrest('2-APHA', '#01a33b'),
    govCrest('35-DfT', '#007161'),
    govCrest('92-IS', '#0b3b7a'),
    govCrest('38-DoH', '#01af9f'),
    govCrest('78-HMT', '#af292e'),
    govCrest('50-50-FCO', '#00467f'),
    govCrest('127-OPG', '#000'),
    govCrest('162-UKGI', '#af292e'),
    govCrest('160-UKDMO', '#af292e')];

const isCrestLogo = (vacancy) => {
    let found = false;
    crestIds.forEach((item) => {
        if (item.id === vacancy.department.identifier) {
            found = true;
        }
    });
    return found;
};

const crestInformation = (vacancy) => {
    let found = {};
    crestIds.forEach((item, i) => {
        if (item.id === vacancy.department.identifier) {
            found = crestIds[i];
        }
    });
    return found;
};

module.exports = {
    isCrestLogo,
    crestInformation,
};
