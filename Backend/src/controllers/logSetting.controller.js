const catchAsync = require('../utils/catchAsync');
const { logSettingService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Get log settings`, { className: "logSetting.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "logSetting.controller", methodName: "getSettings", CID: coId });

    const result = await logSettingService.getSettings(coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on get settings %o` + error, { className: "logSetting.controller", methodName: "getSettings", CID: coId });
  }
});

const createSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Create log settings`, { className: "logSetting.controller", methodName: "createSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "logSetting.controller", methodName: "createSettings", CID: coId });

    const result = await logSettingService.createSettings(req.body,coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on create settings %o` + error, { className: "logSetting.controller", methodName: "createSettings", CID: coId });
  }
});

const updateSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update log settings`, { className: "logSetting.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "logSetting.controller", methodName: "updateSettings", CID: coId });

    const result = await logSettingService.updateSettings(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on update settings %o` + error, { className: "logSetting.controller", methodName: "updateSettings", CID: coId });
  }
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
