const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/reportSetting.validation');
const reportSettingController = require('../../controllers/reportSetting.controller');

router.get('/', reportSettingController.getSettings);
router.put('/', reportSettingController.updateSettings);
router.post('/', reportSettingController.createSettings);

module.exports = router;
