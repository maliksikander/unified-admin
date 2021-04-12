const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/reportSetting.validation');
const reportSettingController = require('../../controllers/reportSetting.controller');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter();


router.get('/', keycloak.enforcer(['reporting:view-reporting'], {
    resource_server_id: 'unified-admin'
}), reportSettingController.getSettings);

router.put('/', keycloak.enforcer(['reporting:update-reporting'], {
    resource_server_id: 'unified-admin'
}), validate(reportValidation.updateSetting), reportSettingController.updateSettings);

router.post('/', keycloak.enforcer(['reporting:create-reporting'], {
    resource_server_id: 'unified-admin'
}), validate(reportValidation.createSetting), reportSettingController.createSettings);

module.exports = router;
