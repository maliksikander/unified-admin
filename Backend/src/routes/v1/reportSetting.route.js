const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/reportSetting.validation');
const reportSettingController = require('../../controllers/reportSetting.controller');

router.get('/', reportSettingController.getReportSettings);
router.put('/', validate(reportValidation.updateReportSetting), reportSettingController.updateReportSettings);
router.post('/', validate(reportValidation.createReportSetting), reportSettingController.createReportSettings);

module.exports = router;
