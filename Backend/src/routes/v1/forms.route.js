const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const formsValidation = require('../../validations/forms.validation');
const formsController = require('../../controllers/forms.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;


router.get('/', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: resource
}), formsController.getForms);

// router.get('/:formID', keycloak.enforcer(['forms:manage-form'], {
//     resource_server_id: resource
// }), formsController.getFormByID);

router.get('/:formID', formsController.getFormByID);

router.put('/', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: resource
}), validate(formsValidation.updateForm), formsController.updateForm);

router.post('/', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: resource
}), validate(formsValidation.createForm), formsController.createForm);

router.delete('/:formID', keycloak.enforcer(['forms:manage-form'], {
    resource_server_id: resource
}), formsController.deleteForm);

module.exports = router;