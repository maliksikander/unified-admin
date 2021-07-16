const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const localeValidation = require('../../validations/localeSetting.validation');
const localeSettingController = require('../../controllers/localeSetting.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;

router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), localeSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), validate(localeValidation.updateSetting), localeSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), validate(localeValidation.createSetting), localeSettingController.createSettings);

module.exports = router;
