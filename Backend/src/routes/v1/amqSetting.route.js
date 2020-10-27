const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const amqValidation = require('../../validations/amqSetting.validation');
const amqSettingController = require('../../controllers/amqSetting.controller');

router.get('/', amqSettingController.getAmqSettings);
router.put('/', validate(amqValidation.updateAmqSetting), amqSettingController.updateAmqSettings);
router.post('/', validate(amqValidation.createAmqSetting), amqSettingController.createAmqSettings);

module.exports = router;
