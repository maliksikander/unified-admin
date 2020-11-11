const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const amqValidation = require('../../validations/amqSetting.validation');
const amqSettingController = require('../../controllers/amqSetting.controller');

router.get('/', amqSettingController.getSettings);
router.put('/', validate(amqValidation.updateSetting), amqSettingController.updateSettings);
router.post('/', validate(amqValidation.createSetting), amqSettingController.createSettings);

module.exports = router;
