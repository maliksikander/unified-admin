const express = require('express');
const router = express.Router();
// const validate = require('../../middlewares/validate');
// const formsValidation = require('../../validations/forms.validation');
const formValidationController = require('../../controllers/formValidation.controller');
var config = require('../../../config.json');
var { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);


// router.get('/', keycloak.enforcer(['forms:manage-form'], {
//     resource_server_id: 'cim'
// }), formValidationController.getFormValidation);

router.get('/', formValidationController.getFormValidation);


// router.put('/', keycloak.enforcer(['forms:manage-form'], {
//     resource_server_id: 'cim'
// }), validate(formValidationValidation.updateForm), formsController.updateForm);

// router.post('/', formValidationController.createFormValidation);

// router.delete('/:formID', keycloak.enforcer(['forms:manage-form'], {
//     resource_server_id: 'cim'
// }), formValidationController.deleteForm);

module.exports = router;