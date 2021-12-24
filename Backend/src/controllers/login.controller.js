const catchAsync = require('../utils/catchAsync');
var config = require('../../config.json');
var { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
const logger = require('../config/logger');

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const realm = config.realm

    try {
        const result = await keycloak.authenticateUserViaKeycloak(username, password, realm).then((res) => {
            return res;
        });
        res.send(result);
    }
    catch (e) {

        if (e && e.response && e.response.status == 401) {
            let msg = "Invalid Credentials";
            res.status(e.response.status).send(msg);
        }

        else if (e && e.response && e.response.status) {
            res.status(e.response.status).send(e.message);
        }
        else {
            res.status(500).send(e.message);
        }
        logger.error('[Login Error]:', e)
    }
};

module.exports = {
    login
};
