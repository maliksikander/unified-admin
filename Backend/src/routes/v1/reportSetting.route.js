const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/reportSetting.validation');
const reportSettingController = require('../../controllers/reportSetting.controller');
var config = require('../../../config.json');
var { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);


router.get('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), reportSettingController.getSettings);

router.put('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), validate(reportValidation.updateSetting), reportSettingController.updateSettings);

router.post('/', keycloak.enforcer(['general-settings:manage'], {
    resource_server_id: 'cim'
}), validate(reportValidation.createSetting), reportSettingController.createSettings);

module.exports = router;
