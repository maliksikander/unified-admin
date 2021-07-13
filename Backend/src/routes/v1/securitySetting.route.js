const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const securityValidation = require('../../validations/securitySetting.validation');
const securitySettingController = require('../../controllers/securitySetting.controller');
var config = require('../../../config.json');
var { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);


router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), securitySettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), validate(securityValidation.updateSetting), securitySettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), validate(securityValidation.createSetting), securitySettingController.createSettings);

module.exports = router;
