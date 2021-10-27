const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const displayValidation = require('../../validations/displaySetting.validation');
const displaySettingController = require('../../controllers/displaySetting.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;


// router.get('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), displaySettingController.getSettings);

// router.put('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(displayValidation.updateSetting), displaySettingController.updateSettings);

// router.post('/', keycloak.enforcer(['general-settings:manage'], {
//     resource_server_id: resource
// }), validate(displayValidation.createSetting), displaySettingController.createSettings);

router.get('/', displaySettingController.getSettings);

router.put('/', validate(displayValidation.updateSetting), displaySettingController.updateSettings);

router.post('/', validate(displayValidation.createSetting), displaySettingController.createSettings);

module.exports = router;
