const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const databaseValidation = require('../../validations/databaseSetting.validation');
const databaseSettingController = require('../../controllers/databaseSetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), databaseSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), validate(databaseValidation.updateSetting), databaseSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), validate(databaseValidation.createSetting), databaseSettingController.createSettings);

module.exports = router;
