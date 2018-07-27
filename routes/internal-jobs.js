const express = require('express');
const _ = require('lodash');
const { check, validationResult } = require('express-validator/check');
const { authenticateInternalOpsRequest } = require('../lib/modules/internalJobs');
const { siteMapSet } = require('../lib/modules/sitemap');

const router = express.Router();

siteMapSet({ url: '/internal-jobs' });


/* GET internal jobs. */
router.get('/', (req, res) => res.render('pages/internal-jobs/index', {
    title: __('internalJobs.page.title'),
}));

/* POST internal jobs. */
router.post('/', [

    check('email')
        .trim()
        .isLength({ min: 1 })
        .withMessage('global.messages.emailRequired')
        .isEmail()
        .withMessage('global.messages.emailInvalid'),

], async (req, res, next) => {
    const validate = validationResult(req);
    const formData = req.body;
    const formValid = validate.isEmpty();
    let response;
    let success = false;
    let departmentList;

    if (formValid) {
        response = await authenticateInternalOpsRequest(formData.email, formData.departmentID, next);
        if (response === true) {
            success = true;
        }
        if (!_.isUndefined(response.departments)) {
            departmentList = response.departments;
            success = false;
        }
    }

    return res.render('pages/internal-jobs/index', {
        title: __('internalJobs.page.title'),
        errors: () => {
            if (!formValid) {
                return validate.mapped();
            }
            if (_.get(response, 'vacancyError.status') === 'UNAUTHORIZED') {
                return { email: { msg: 'global.messages.emailUnauthorised' } };
            }
            return null;
        },
        formData,
        success,
        departments: response.departments ? departmentList : null,
    });
});

module.exports = router;
