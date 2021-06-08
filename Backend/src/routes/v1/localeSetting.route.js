const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const localeValidation = require('../../validations/localeSetting.validation');
const localeSettingController = require('../../controllers/localeSetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), localeSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(localeValidation.updateSetting), localeSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(localeValidation.createSetting), localeSettingController.createSettings);

module.exports = router;
