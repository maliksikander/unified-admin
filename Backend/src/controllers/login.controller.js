// const httpStatus = require('http-status');
// const Keycloak = require("keycloak_adapter");
// const keycloak = Keycloak.NodeAdapter;


var { NodeAdapter } = require("keycloak-nodejs-connect");

var config = {
    "realm": "cim",
    "auth-server-url": "http://192.168.1.204",
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
// const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
// const ApiError = require('../utils/ApiError');
// const httpStatus = require('http-status');


const login = catchAsync(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // console.log(username,"////",password)
    keycloak.authenticateUserViaKeycloak(username, password,'cim').then((result) => {
        // console.log("result==>",result)
        res.send(result);
    }).catch((err) => {
        if (err.message == "Request failed with status code 401") return res.status(401).send(err);
        console.log("Authentication Error ==>", err)
        res.status(500).send(err);
    });
    // keycloak.userAuthentication(username, password).then((result) => {
    //     res.send(result.data);
    // }).catch((err) => {
    //     if (err.message == "Request failed with status code 401") return res.status(401).send(err);
    //     res.status(500).send(err);
    // });
});

module.exports = {
    login
};
