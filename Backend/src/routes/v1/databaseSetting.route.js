const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const databaseValidation = require('../../validations/databaseSetting.validation');
const databaseSettingController = require('../../controllers/databaseSetting.controller');

router.get('/', databaseSettingController.getSettings);
router.put('/', validate(databaseValidation.updateSetting), databaseSettingController.updateSettings);
router.post('/', validate(databaseValidation.createSetting), databaseSettingController.createSettings);

module.exports = router;
