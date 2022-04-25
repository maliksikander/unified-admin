const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const securityValidation = require('../../validations/securitySetting.validation');
const securitySettingController = require('../../controllers/securitySetting.controller');

router.get('/', securitySettingController.getSettings);

router.put('/', validate(securityValidation.updateSetting), securitySettingController.updateSettings);

router.post('/', validate(securityValidation.createSetting), securitySettingController.createSettings);

module.exports = router;
