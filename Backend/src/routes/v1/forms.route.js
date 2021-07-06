const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const formsValidation = require('../../validations/forms.validation');
const formsController = require('../../controllers/forms.controller');
var config = require('../../../config.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);


router.get('/', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: 'cim'
}), formsController.getForms);

router.get('/:formID', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: 'cim'
}), formsController.getFormByID);

router.put('/', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: 'cim'
}), validate(formsValidation.updateForm), formsController.updateForm);

router.post('/', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: 'cim'
}), validate(formsValidation.createForm), formsController.createForm);

router.delete('/:formID', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: 'cim'
}), formsController.deleteForm);

module.exports = router;