const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const localeValidation = require('../../validations/localeSetting.validation');
const localeSettingController = require('../../controllers/localeSetting.controller');

router.get('/', localeSettingController.getLocaleSettings);
router.put('/', validate(localeValidation.updateLocaleSetting), localeSettingController.updateLocaleSettings);
router.post('/', validate(localeValidation.createLocaleSetting), localeSettingController.createLocaleSettings);

module.exports = router;
