var { NodeAdapter } = require("keycloak-nodejs-connect");
const keycloak = new NodeAdapter();
const catchAsync = require('../utils/catchAsync');
const configObj = require('../../config.json');

const login = catchAsync(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const realm = configObj.realm
  

  const result  = await keycloak.authenticateUserViaKeycloak(username, password, realm).then((res) => {
        // res.send(result);
        return res
    });
    // console.log("login result-->",result);
     res.send(result);

});

module.exports = {
    login
};
