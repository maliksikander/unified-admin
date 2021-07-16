const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const logValidation = require('../../validations/logSetting.validation');
const logSettingController = require('../../controllers/logSetting.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;


router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), logSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), validate(logValidation.updateSetting), logSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), validate(logValidation.createSetting), logSettingController.createSettings);

module.exports = router;
