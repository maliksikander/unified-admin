const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const amqValidation = require('../../validations/amqSetting.validation');
const amqSettingController = require('../../controllers/amqSetting.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;


// router.get('/', keycloak.enforcer(['general-settings:manage','general-settings:view'], {
//     resource_server_id: resource
// }), amqSettingController.getSettings);

// router.put('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(amqValidation.updateSetting), amqSettingController.updateSettings);

// router.post('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(amqValidation.createSetting), amqSettingController.createSettings);

router.get('/', amqSettingController.getSettings);

router.put('/', validate(amqValidation.updateSetting), amqSettingController.updateSettings);

router.post('/', validate(amqValidation.createSetting), amqSettingController.createSettings);

module.exports = router;
