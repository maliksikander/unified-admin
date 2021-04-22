const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const databaseValidation = require('../../validations/databaseSetting.validation');
const databaseSettingController = require('../../controllers/databaseSetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

router.get('/', keycloak.enforcer(['database:view-database'], {
    resource_server_id: 'unified-admin'
}), databaseSettingController.getSettings);

router.put('/', keycloak.enforcer(['database:update-database'], {
    resource_server_id: 'unified-admin'
}), validate(databaseValidation.updateSetting), databaseSettingController.updateSettings);

router.post('/', keycloak.enforcer(['database:create-database'], {
    resource_server_id: 'unified-admin'
}), validate(databaseValidation.createSetting), databaseSettingController.createSettings);

module.exports = router;
