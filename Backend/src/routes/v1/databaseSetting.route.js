const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const databaseValidation = require('../../validations/databaseSetting.validation');
const databaseSettingController = require('../../controllers/databaseSetting.controller');

router.get('/', databaseSettingController.getDatabaseSettings);
router.put('/', validate(databaseValidation.updateDatabaseSetting), databaseSettingController.updateDatabaseSettings);
router.post('/', validate(databaseValidation.createDatabaseSetting), databaseSettingController.createDatabaseSettings);

module.exports = router;
