const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const amqValidation = require('../../validations/amqSetting.validation');
const amqSettingController = require('../../controllers/amqSetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

router.get('/', keycloak.enforcer(['amq:view-amq'], {
    resource_server_id: 'unified-admin'
}), amqSettingController.getSettings);

router.put('/', keycloak.enforcer(['amq:update-amq'], {
    resource_server_id: 'unified-admin'
}), validate(amqValidation.updateSetting), amqSettingController.updateSettings);

router.post('/', keycloak.enforcer(['amq:create-amq'], {
    resource_server_id: 'unified-admin'
}), validate(amqValidation.createSetting), amqSettingController.createSettings);

module.exports = router;
