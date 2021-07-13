const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const displayValidation = require('../../validations/displaySetting.validation');
const displaySettingController = require('../../controllers/displaySetting.controller');
var config = require('../../../config.json');
var { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);


router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), displaySettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(displayValidation.updateSetting), displaySettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'CIM'
}), validate(displayValidation.createSetting), displaySettingController.createSettings);

module.exports = router;
