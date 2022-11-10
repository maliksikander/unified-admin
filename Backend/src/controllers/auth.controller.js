const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const register = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Auth register`, { className: "auth.controller", methodName: "register", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "auth.controller", methodName: "register", CID: coId });

    const user = await userService.createUser(req.body,coId);
    const tokens = await tokenService.generateAuthTokens(user,coId);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    logger.error(`[ERROR] on register api: %o` + error, { className: "auth.controller", methodName: "register", CID: coId });
  }
});

const login = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Auth login`, { className: "auth.controller", methodName: "login", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "auth.controller", methodName: "login", CID: coId });

    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password,coId);
    const tokens = await tokenService.generateAuthTokens(user,coId);
    res.send({ user, tokens });
  } catch (error) {
    logger.error(`[ERROR] on login api: %o` + error, { className: "auth.controller", methodName: "login", CID: coId });
  }
});

const logout = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Auth Logout`, { className: "auth.controller", methodName: "logout", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "auth.controller", methodName: "logout", CID: coId });

    await authService.logout(req.body.refreshToken,coId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    logger.error(`[ERROR] on logout api: %o` + error, { className: "auth.controller", methodName: "logout", CID: coId });
  }
});

const refreshTokens = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Auth refresh token`, { className: "auth.controller", methodName: "refreshTokens", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "auth.controller", methodName: "refreshTokens", CID: coId });

    const tokens = await authService.refreshAuth(req.body.refreshToken,coId);
    res.send({ ...tokens });
  } catch (error) {
    logger.error(`[ERROR] on refresh token api: %o` + error, { className: "auth.controller", methodName: "refreshTokens", CID: coId });
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Auth forgot password`, { className: "auth.controller", methodName: "forgotPassword", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "auth.controller", methodName: "forgotPassword", CID: coId });

    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email,coId);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, coId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    logger.error(`[ERROR] on forgot password api: %o` + error, { className: "auth.controller", methodName: "forgotPassword", CID: coId });
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Auth reset password`, { className: "auth.controller", methodName: "resetPassword", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "auth.controller", methodName: "resetPassword", CID: coId });

    await authService.resetPassword(req.query.token, req.body.password, coId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    logger.error(`[ERROR] on reset password api: %o` + error, { className: "auth.controller", methodName: "resetPassword", CID: coId });
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
