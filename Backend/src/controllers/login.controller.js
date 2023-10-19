const catchAsync = require("../utils/catchAsync");
var config = require("../../config.json");
var { NodeAdapter } = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config);
const logger = require("../config/logger");
const { v4: uuidv4 } = require("uuid");
const { error } = require("winston");
// var CryptoJS = require("crypto-js");
// var AES = require("crypto-js/aes")

const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const realm = config.realm;

  const coId = req.header("correlationId".toLowerCase())
    ? req.header("correlationId".toLowerCase())
    : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Login`, {
      className: "login.controller",
      methodName: "login",
    });
    logger.debug(`[REQUEST] : %o` + req.body, {
      className: "login.controller",
      methodName: "login",
    });

    // let decryptedUsername = CryptoJS.AES.decrypt(username, "undlusia").toString(CryptoJS.enc.Utf8);
    // let decryptedPassword = CryptoJS.AES.decrypt(password, "undlusia").toString(CryptoJS.enc.Utf8);
    const result = await keycloak
      .authenticateUserViaKeycloak(username, password, realm, "", [], "")
      .then((response) => {
        return response; 
      });
    res.send(result);
  } catch (e) {

    logger.error(`[ERROR] on login %o`, JSON.stringify(e), {
      className: "login.controller",
      methodName: "login",
    });
    let errorResponse = {
      error_message: e.error_message,
      error_detail: {
        status: e.error_detail.status,
        reason: e.error_detail.reason,
      }
    };
    res.status(errorResponse.error_detail.status);
  
    res.json(errorResponse);
  }
};

module.exports = {
  login,
};
