const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/login.controller');
let config = require('../../../config.json');
let { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
let resource = config.resource;

// router.post('/', keycloak.enforcer(['login:login-scope'], {
//     resource_server_id: resource
// }), loginController.login);

router.post('/', loginController.login);

module.exports = router;
