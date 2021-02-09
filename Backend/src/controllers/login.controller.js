// const httpStatus = require('http-status');
const Keycloak = require("keycloak_adapter");
const keycloak = Keycloak.NodeAdapter;
// const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
// const ApiError = require('../utils/ApiError');
// const httpStatus = require('http-status');


const login = catchAsync(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // console.log(username,"////",password)
    // keycloak.authenticateUserViaKeycloak(username, password).then((result) => {
    //     res.send(result.data);
    // }).catch((err) => {
    //     if (err.message == "Request failed with status code 401") return res.status(401).send(err);
    //     res.status(500).send(err);
    // });
    keycloak.userAuthentication(username, password).then((result) => {
        res.send(result.data);
    }).catch((err) => {
        if (err.message == "Request failed with status code 401") return res.status(401).send(err);
        res.status(500).send(err);
    });
});

module.exports = {
    login
};
