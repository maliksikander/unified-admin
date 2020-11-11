const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/reportSetting.validation');
const reportSettingController = require('../../controllers/reportSetting.controller');

router.get('/', reportSettingController.getSettings);
router.put('/', validate(reportValidation.updateSetting), reportSettingController.updateSettings);
router.post('/', validate(reportValidation.createSetting), reportSettingController.createSettings);

module.exports = router;
