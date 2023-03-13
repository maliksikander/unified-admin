const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const logValidation = require('../../validations/logSetting.validation');
const logSettingController = require('../../controllers/logSetting.controller');

router.get('/', logSettingController.getSettings);

router.put('/', validate(logValidation.updateSetting), logSettingController.updateSettings);

router.post('/', validate(logValidation.createSetting), logSettingController.createSettings);

module.exports = router;
