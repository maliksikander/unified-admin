const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const securityValidation = require('../../validations/securitySetting.validation');
const securitySettingController = require('../../controllers/securitySetting.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;


// router.get('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), securitySettingController.getSettings);

// router.put('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(securityValidation.updateSetting), securitySettingController.updateSettings);

// router.post('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(securityValidation.createSetting), securitySettingController.createSettings);

router.get('/', securitySettingController.getSettings);

router.put('/', validate(securityValidation.updateSetting), securitySettingController.updateSettings);

router.post('/', validate(securityValidation.createSetting), securitySettingController.createSettings);

module.exports = router;
