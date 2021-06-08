const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const amqValidation = require('../../validations/amqSetting.validation');
const amqSettingController = require('../../controllers/amqSetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

router.get('/', keycloak.enforcer(['general-settings:manage','general-settings:view'], {
    resource_server_id: 'CIM'
}), amqSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(amqValidation.updateSetting), amqSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(amqValidation.createSetting), amqSettingController.createSettings);

module.exports = router;
