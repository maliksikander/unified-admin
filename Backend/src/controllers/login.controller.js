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
    // console.error("[Login Error]==>", e);
    logger.error(`[ERROR] on login %o`, JSON.stringify(e), {
      className: "login.controller",
      methodName: "login",
    });
    let msg;
    if (e && e.status == 401) {
      if (e.errorMessage && e.errorMessage.error_description)
        msg = e.errorMessage.error_description;
      else msg = "Invalid Credentials";
      res.status(e.status).send(msg);
    } else if (e && e.response && e.response.status) {
      res.status(e.response.status).send(e.message);
    } else {
      let status = e.status ? e.status : 500;
      if (e.message) msg = e.message;
      else if (e.error) msg = e.error;
      res.status(status).send(msg);
    }
  }
};

module.exports = {
  login,
};
