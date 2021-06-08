const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const formsValidation = require('../../validations/forms.validation');
const formsController = require('../../controllers/forms.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

router.get('/', keycloak.enforcer(['forms:manage'], {
    resource_server_id: 'CIM'
}), formsController.getForms);

router.put('/', keycloak.enforcer(['forms:manage'], {
    resource_server_id: 'CIM'
}), validate(formsValidation.updateForm), formsController.updateForm);

router.post('/', keycloak.enforcer(['forms:manage'], {
    resource_server_id: 'CIM'
}), validate(formsValidation.createForm), formsController.createForm);

router.delete('/:formID', keycloak.enforcer(['forms:manage'], {
    resource_server_id: 'CIM'
}), formsController.deleteForm);

module.exports = router;