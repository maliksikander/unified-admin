const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires,coId, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  logger.info(`Generated Token`, { className: "token.service", methodName: "generateToken" , CID: coId });
  logger.debug(`[DATA] %o` + payload,  { className: "token.service", methodName: "generateToken", CID: coId });
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const  saveToken = async (token, userId, expires, type,coId, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  logger.info(`Token Saved`, { className: "token.service", methodName: "saveToken" , CID: coId });
  logger.debug(`[DATA] %o` + tokenDoc,  { className: "token.service", methodName: "saveToken", CID: coId });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type, coId) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    logger.error(`Token not found`, { className: "token.service", methodName: "verifyToken", CID: coId });
    throw new Error('Token not found');
  }
  logger.info(`Token Verified`, { className: "token.service", methodName: "verifyToken" , CID: coId });
  logger.debug(`[DATA] %o` + payload,  { className: "token.service", methodName: "verifyToken", CID: coId });
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user,coId) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires);
  await saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');
  logger.info(`Generate Auth Tokens`, { className: "token.service", methodName: "generateAuthTokens" , CID: coId });
  logger.debug(`[DATA] %o` + refreshToken,  { className: "token.service", methodName: "generateAuthTokens", CID: coId });
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email,coId) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    logger.error(`[NOT FOUND] No users found with this email`, { className: "token.service", methodName: "generateResetPasswordToken", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires);
  await saveToken(resetPasswordToken, user.id, expires, 'resetPassword');
  logger.info(`Generate Reset Password Token`, { className: "token.service", methodName: "generateResetPasswordToken" , CID: coId });
  logger.debug(`[DATA] %o` + user,  { className: "token.service", methodName: "generateResetPasswordToken", CID: coId });
  return resetPasswordToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
};
