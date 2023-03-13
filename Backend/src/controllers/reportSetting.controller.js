// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reportSettingService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Get report settings`, { className: "reportSetting.controller", methodName: "getSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body , { className: "reportSetting.controller", methodName: "getSettings", CID: coId });

    const result = await reportSettingService.getSettings(coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR on getSettings %o` + error, { className: "reportSetting.controller", methodName: "getSettings", CID: coId });
  }
});

const createSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Create report settings`, { className: "reportSetting.controller", methodName: "createSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body , { className: "reportSetting.controller", methodName: "createSettings", CID: coId });

    const result = await reportSettingService.createSettings(req.body,coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on createSettings %o` + error, { className: "reportSetting.controller", methodName: "createSettings", CID: coId });
  }
});

const updateSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update report settings`, { className: "reportSetting.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body , { className: "reportSetting.controller", methodName: "updateSettings", CID: coId });

    const result = await reportSettingService.updateSettings(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on updateSettings %o` + error, { className: "reportSetting.controller", methodName: "updateSettings", CID: coId });
  }
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
