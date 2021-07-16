const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/reportSetting.validation');
const reportSettingController = require('../../controllers/reportSetting.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;


router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), reportSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), validate(reportValidation.updateSetting), reportSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: resource
}), validate(reportValidation.createSetting), reportSettingController.createSettings);

module.exports = router;
