const express = require('express');

const router = express.Router();
const validate = require('../../middlewares/validate');
const formsValidation = require('../../validations/forms.validation');
const formsController = require('../../controllers/forms.controller');
var config = require('../../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);


// keycloak.enforcer(['forms:view-forms'], {
//     resource_server_id: 'unified-admin'
// }),
router.get('/', formsController.getForms);


// keycloak.enforcer(['forms:view-forms'], {
//     resource_server_id: 'unified-admin'
// }),
// router.get('/?formID', formsController.getForms);

// keycloak.enforcer(['forms:update-forms'], {
//     resource_server_id: 'unified-admin'
// }),
router.put('/', validate(formsValidation.updateForm), formsController.updateForm);

// keycloak.enforcer(['forms:create-forms'], {
//     resource_server_id: 'unified-admin'
// }), 
router.post('/', validate(formsValidation.createForm), formsController.createForm);

// keycloak.enforcer(['forms:delete-forms'], {
//     resource_server_id: 'unified-admin'
// }),
router.delete('/:formID', formsController.deleteForm);

module.exports = router;
