const catchAsync = require('../utils/catchAsync');
var config = require('../../keycloak.json');
var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter(config);

const login = catchAsync(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const realm = config.realm


    const result = await keycloak.authenticateUserViaKeycloak(username, password, realm).then((res) => {
        return res;
    });
    res.send(result);
});

module.exports = {
    login
};
