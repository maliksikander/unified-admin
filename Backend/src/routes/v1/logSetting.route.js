const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const logValidation = require('../../validations/logSetting.validation');
const logSettingController = require('../../controllers/logSetting.controller');

router.get('/', logSettingController.getLogSettings);
router.put('/', validate(logValidation.updateLogSetting), logSettingController.updateLogSettings);
router.post('/', validate(logValidation.createLsogSetting), logSettingController.createLogSettings);

module.exports = router;
