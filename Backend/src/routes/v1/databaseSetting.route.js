const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const databaseValidation = require('../../validations/databaseSetting.validation');
const databaseSettingController = require('../../controllers/databaseSetting.controller');
var config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
let keycloak = new NodeAdapter(config);
let resource = config.resource;

// router.get('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), databaseSettingController.getSettings);

// router.put('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(databaseValidation.updateSetting), databaseSettingController.updateSettings);

// router.post('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(databaseValidation.createSetting), databaseSettingController.createSettings);

router.get('/', databaseSettingController.getSettings);

router.put('/', validate(databaseValidation.updateSetting), databaseSettingController.updateSettings);

router.post('/', validate(databaseValidation.createSetting), databaseSettingController.createSettings);

module.exports = router;
