const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password,coId) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    logger.error(`[UNAUTHORIZED] Incorrect email or password`, { className: "auth.service", methodName: "loginUserWithEmailAndPassword", CID: coId });
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  logger.info(`Correct email and password`, { className: "auth.service", methodName: "loginUserWithEmailAndPassword", CID: coId });
  logger.debug(`[DATA] %o` + user,  { className: "auth.service", methodName: "loginUserWithEmailAndPassword", CID: coId });
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken,coId) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: 'refresh', blacklisted: false });
  if (!refreshTokenDoc) {
    logger.error(`[NOT_FOUND] Not found`, { className: "auth.service", methodName: "logout", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  logger.info(`logout successfully`, { className: "auth.service", methodName: "logout", CID: coId });
  logger.debug(`[DATA] %o` + refreshTokenDoc,  { className: "auth.service", methodName: "logout", CID: coId });
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken, coId) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      logger.error(`User not found`, { className: "auth.service", methodName: "refreshAuth", CID: coId });
      throw new Error();
    }
    logger.info(`Auth Refreshed`, { className: "auth.service", methodName: "refreshAuth", CID: coId });
    logger.debug(`[DATA] %o` + user,  { className: "auth.service", methodName: "refreshAuth", CID: coId });
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    logger.error(`[UNAUTHORIZED] Please authenticate`, { className: "auth.service", methodName: "refreshAuth", CID: coId });
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword,coId) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'resetPassword');
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      logger.error(`User not found`, { className: "auth.service", methodName: "resetPassword", CID: coId });
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: 'resetPassword' });
    await userService.updateUserById(user.id, { password: newPassword });
    logger.info(`Password reset`, { className: "auth.service", methodName: "resetPassword", CID: coId });
    logger.debug(`[DATA] %o` + user,  { className: "auth.service", methodName: "resetPassword", CID: coId });
  } catch (error) {
    logger.error(`[UNAUTHORIZED] Password reset failed`, { className: "auth.service", methodName: "resetPassword", CID: coId });
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
};
