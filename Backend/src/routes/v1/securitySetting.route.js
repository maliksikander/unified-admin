const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const securityValidation = require('../../validations/securitySetting.validation');
const securitySettingController = require('../../controllers/securitySetting.controller');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter();


router.get('/', keycloak.enforcer(['security:view-security'], {
    resource_server_id: 'unified-admin'
}), securitySettingController.getSettings);

router.put('/', keycloak.enforcer(['security:update-security'], {
    resource_server_id: 'unified-admin'
}), validate(securityValidation.updateSetting), securitySettingController.updateSettings);

router.post('/', keycloak.enforcer(['security:create-security'], {
    resource_server_id: 'unified-admin'
}), validate(securityValidation.createSetting), securitySettingController.createSettings);

module.exports = router;
