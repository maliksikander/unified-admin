// const session = require('express-session');
// const Keycloak = require('keycloak-connect');
// const config = require('../../keycloak.json');
// const express = require('express');
// const app = express();


// let _keycloak;
// // credentials: {
// // secret: '27080cdf-cdd8-4db1-b3ee-fdb0669b0222'
// // }
// // realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlOPr9cwFSa5RLHhdnpZc1+PVRU0l+roAHfY0GvbARRY2n3c7OZU36kx0mYO8Z9p64DeDbBioGlMzbBxufc2WeqTqAljmJMyck34iThEC0qWZhlRqhBoj5VaOopViUVcsrDTcHDEzsF700QqIgqUYv73x+uCGHGvkCB/o5xtn5n6BzQ0BTCE01p0gf9tPEQA9t5pxJ5bpowFnU0FSTRzp88dV8mmtEt4Nk6yCdro+zYvcQ39rrkAF5gwR2EQsx/ZaorDIwVp1QelJSIidGdZOFELKdbUjdwy5i7ieLH4sFemtRsq8JFQMzLKCOy293ACS7u9mP/Fx0aRBSdinPqH1ZQIDAQAB'
// var keycloakConfig = {
//     clientId: 'unified-admin',
//     bearerOnly: true,
//     policyEnforcer: {},
//     verifyTokenAudience: true,
//     serverUrl: 'http://192.168.1.204:8080/auth',
//     realm: 'cim',
//     realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlOPr9cwFSa5RLHhdnpZc1+PVRU0l+roAHfY0GvbARRY2n3c7OZU36kx0mYO8Z9p64DeDbBioGlMzbBxufc2WeqTqAljmJMyck34iThEC0qWZhlRqhBoj5VaOopViUVcsrDTcHDEzsF700QqIgqUYv73x+uCGHGvkCB/o5xtn5n6BzQ0BTCE01p0gf9tPEQA9t5pxJ5bpowFnU0FSTRzp88dV8mmtEt4Nk6yCdro+zYvcQ39rrkAF5gwR2EQsx/ZaorDIwVp1QelJSIidGdZOFELKdbUjdwy5i7ieLH4sFemtRsq8JFQMzLKCOy293ACS7u9mP/Fx0aRBSdinPqH1ZQIDAQAB'
// };

// function initKeycloak() {
//     if (_keycloak) {
//         console.warn("Trying to init Keycloak again!");
//         return _keycloak;
//     }
//     else {
//         console.log("Initializing Keycloak...");
//         var memoryStore = new session.MemoryStore();
//         _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

//         app.use(session({
//             secret: 'secretfweffwfwfw112',
//             resave: false,
//             saveUninitialized: true,
//             store: memoryStore
//         }));

//         app.use(_keycloak.middleware({
//             admin: '/',
//             protected: '/protected/resources'
//         }));

//         return _keycloak;
//     }
// }

// function getKeycloak() {
//     if (!_keycloak) {
//         console.error('Keycloak has not been initialized. Please called init first.');
//     }
//     return _keycloak;
// }

// module.exports = {
//     initKeycloak,
//     getKeycloak
// };