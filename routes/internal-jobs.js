const express = require('express');
const _ = require('lodash');
const { check, validationResult } = require('express-validator/check');
const { authenticateInternalOpsRequest } = require('../lib/modules/internalJobs');

const router = express.Router();

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
    let success;
    let departmentList;

    if (formValid) {
        success = await authenticateInternalOpsRequest(formData.email, formData.departmentID, next);
        // console.log('success');
        // console.log(success);
        // console.log(_.has(success, 'departments'), !_.isNil(success.departments));
        if (!_.isNil(success.departments)) {
            departmentList = success.departments;
            success = false;
        }
        if (!_.isNil(success.vacancyError)) {
            departmentList = success.departments;
            success = false;
        }
    }
    // console.log(success);
    return res.render('pages/internal-jobs/index', {
        title: __('internalJobs.page.title'),
        errors: !formValid ? validate.mapped() : null,
        formData,
        success,
        departments: success.departments ? departmentList : null,
    });
});

module.exports = router;
