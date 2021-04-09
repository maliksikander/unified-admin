const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const amqValidation = require('../../validations/amqSetting.validation');
const amqSettingController = require('../../controllers/amqSetting.controller');

var session = require('express-session');
var memoryStore = new session.MemoryStore();
const app = express();
var { NodeAdapter } = require("keycloak-nodejs-connect");

var config = {
    "realm": "cim",
    "auth-server-url": "http://192.168.1.204:8080/auth/",
    "ssl-required": "external",
    "resource": "unified-admin",
    "verify-token-audience": false,
    "credentials": {
      "secret": "27080cdf-cdd8-4db1-b3ee-fdb0669b0222"
    },
    "use-resource-role-mappings": true,
    "confidential-port": 0,
    "policy-enforcer": {},
    "HOST": "http://192.168.1.204",
    "PORT": "8080",
    "CLIENT_ID": "unified-admin",
    "CLIENT_SECRET": "27080cdf-cdd8-4db1-b3ee-fdb0669b0222",
    "CLIENT_DB_ID": "95536d4e-c5d5-4876-8cc3-99025e18fc60",
    "GRANT_TYPE": "password",
    "REALM": "cim",
    "GRANT_TYPE_PAT": "client_credentials",
    "USERNAME_ADMIN": "uadmin",
    "PASSWORD_ADMIN": "uadmin",
    "SCOPE_NAME": "Any deafult scope",
    "bearer-only":true
};

const keycloak = new NodeAdapter(config);


app.use(session({
    secret: 'secret1',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

router.get('/', keycloak.protect(), amqSettingController.getSettings);
router.put('/', validate(amqValidation.updateSetting), amqSettingController.updateSettings);
router.post('/', validate(amqValidation.createSetting), amqSettingController.createSettings);

module.exports = router;
