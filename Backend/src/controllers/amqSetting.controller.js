const catchAsync = require('../utils/catchAsync');
const { amqSettingService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Get AMQ settings`, { className: "amqSetting.controller", methodName: "getSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "amqSetting.controller", methodName: "getSettings", CID: coId });

    const result = await amqSettingService.getSettings(coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on get AMQ setting api: %o` + error, { className: "amqSetting.controller", methodName: "getSettings", CID: coId });
  }
});

const createSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Create AMQ settings`, { className: "amqSetting.controller", methodName: "createSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "amqSetting.controller", methodName: "createSettings", CID: coId });

    const result = await amqSettingService.createSettings(req.body,coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on create AMQ setting api: %o` + error, { className: "amqSetting.controller", methodName: "createSettings", CID: coId });
  }
});

const updateSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update AMQ setting`, { className: "amqSetting.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "amqSetting.controller", methodName: "updateSettings", CID: coId });

    const result = await amqSettingService.updateSettings(req.body,coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on Update AMQ setting api: %o` + error, { className: "amqSetting.controller", methodName: "updateSettings", CID: coId });
  }
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
