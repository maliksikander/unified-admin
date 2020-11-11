const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const displayValidation = require('../../validations/displaySetting.validation');
const displaySettingController = require('../../controllers/displaySetting.controller');

router.get('/', displaySettingController.getSettings);
router.put('/', validate(displayValidation.updateSetting), displaySettingController.updateSettings);
router.post('/', validate(displayValidation.createSetting), displaySettingController.createSettings);

module.exports = router;
