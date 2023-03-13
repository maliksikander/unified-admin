const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const localeValidation = require('../../validations/localeSetting.validation');
const localeSettingController = require('../../controllers/localeSetting.controller');

router.get('/', localeSettingController.getSettings);

router.put('/', validate(localeValidation.updateSetting), localeSettingController.updateSettings);

router.post('/', validate(localeValidation.createSetting), localeSettingController.createSettings);

module.exports = router;
