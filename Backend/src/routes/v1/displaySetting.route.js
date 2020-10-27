const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const displayValidation = require('../../validations/displaySetting.validation');
const displaySettingController = require('../../controllers/displaySetting.controller');

router.get('/', displaySettingController.getDisplaySettings);
router.put('/', validate(displayValidation.updateDisplaySetting), displaySettingController.updateDisplaySettings);
router.post('/', validate(displayValidation.createDisplaySetting), displaySettingController.createDisplaySettings);

module.exports = router;
