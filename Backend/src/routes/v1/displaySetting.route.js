const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const displayValidation = require('../../validations/displaySetting.validation');
const displaySettingController = require('../../controllers/displaySetting.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);


router.get('/', keycloak.enforcer(['display:view-display'], {
    resource_server_id: 'unified-admin'
}), displaySettingController.getSettings);

router.put('/', keycloak.enforcer(['display:update-display'], {
    resource_server_id: 'unified-admin'
}), validate(displayValidation.updateSetting), displaySettingController.updateSettings);

router.post('/', keycloak.enforcer(['display:create-display'], {
    resource_server_id: 'unified-admin'
}), validate(displayValidation.createSetting), displaySettingController.createSettings);

module.exports = router;
