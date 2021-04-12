const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const logValidation = require('../../validations/logSetting.validation');
const logSettingController = require('../../controllers/logSetting.controller');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter();


router.get('/', keycloak.enforcer(['log:view-log'], {
    resource_server_id: 'unified-admin'
}), logSettingController.getSettings);

router.put('/', keycloak.enforcer(['log:update-log'], {
    resource_server_id: 'unified-admin'
}), validate(logValidation.updateSetting), logSettingController.updateSettings);

router.post('/', keycloak.enforcer(['log:create-log'], {
    resource_server_id: 'unified-admin'
}), validate(logValidation.createSetting), logSettingController.createSettings);

module.exports = router;
