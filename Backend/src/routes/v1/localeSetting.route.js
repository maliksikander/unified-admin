const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const localeValidation = require('../../validations/localeSetting.validation');
const localeSettingController = require('../../controllers/localeSetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

router.get('/', keycloak.enforcer(['locale:view-locale'], {
    resource_server_id: 'unified-admin'
}), localeSettingController.getSettings);

router.put('/', keycloak.enforcer(['locale:update-locale'], {
    resource_server_id: 'unified-admin'
}), validate(localeValidation.updateSetting), localeSettingController.updateSettings);

router.post('/', keycloak.enforcer(['locale:create-locale'], {
    resource_server_id: 'unified-admin'
}), validate(localeValidation.createSetting), localeSettingController.createSettings);

module.exports = router;
