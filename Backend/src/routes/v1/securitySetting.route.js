const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const securityValidation = require('../../validations/securitySetting.validation');
const securitySettingController = require('../../controllers/securitySetting.controller');

router.get('/', securitySettingController.getSecuritySettings);
router.put('/', validate(securityValidation.updateSecuritySetting), securitySettingController.updateSecuritySettings);
router.post('/', validate(securityValidation.createSecuritySetting), securitySettingController.createSecuritySettings);

module.exports = router;
