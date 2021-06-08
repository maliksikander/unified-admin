const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const logValidation = require('../../validations/logSetting.validation');
const logSettingController = require('../../controllers/logSetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);


router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), logSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(logValidation.updateSetting), logSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(logValidation.createSetting), logSettingController.createSettings);

module.exports = router;
