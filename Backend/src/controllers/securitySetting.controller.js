const catchAsync = require('../utils/catchAsync');
const { securitySettingService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Get security settings`, { className: "securitySetting.controller", methodName: "getSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body , { className: "securitySetting.controller", methodName: "getSettings", CID: coId });

    const result = await securitySettingService.getSettings(coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on get security settings %o` + error, { className: "securitySetting.controller", methodName: "getSettings", CID: coId });
  }
});

const createSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Create security settings`, { className: "securitySetting.controller", methodName: "createSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body , { className: "securitySetting.controller", methodName: "createSettings", CID: coId });

    const result = await securitySettingService.createSettings(req.body,coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on create security settings %o` + error, { className: "securitySetting.controller", methodName: "createSettings", CID: coId });
  }
});

const updateSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update security settings`, { className: "securitySetting.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body , { className: "securitySetting.controller", methodName: "updateSettings", CID: coId });

    const result = await securitySettingService.updateSettings(req.body,coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on update security settings %o` + error, { className: "securitySetting.controller", methodName: "updateSettings", CID: coId });
  }
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
