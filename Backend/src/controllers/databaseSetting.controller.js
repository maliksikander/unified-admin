const catchAsync = require('../utils/catchAsync');
const { databaseSettingService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Get database settings`, { className: "databaseSetting.controller", methodName: "getSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "databaseSetting.controller", methodName: "getSettings", CID: coId });

    const result = await databaseSettingService.getSettings(coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on get setting api: %o` + error, { className: "databaseSetting.controller", methodName: "getSettings", CID: coId });
  }
});

const createSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Create database settings`, { className: "databaseSetting.controller", methodName: "createSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "databaseSetting.controller", methodName: "createSettings", CID: coId });

    const result = await databaseSettingService.createSettings(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on create setting api: %o` + error, { className: "databaseSetting.controller", methodName: "createSettings", CID: coId });
  }
});

const updateSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update database settings`, { className: "databaseSetting.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "databaseSetting.controller", methodName: "updateSettings", CID: coId });

    const result = await databaseSettingService.updateSettings(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on update setting api: %o` + error, { className: "databaseSetting.controller", methodName: "updateSettings", CID: coId });
  }
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
