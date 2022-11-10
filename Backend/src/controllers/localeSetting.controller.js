const catchAsync = require('../utils/catchAsync');
const { localeSettingService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Get locale settings`, { className: "localeSetting.controller", methodName: "getSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "localeSetting.controller", methodName: "getSettings", CID: coId });

    const result = await localeSettingService.getSettings(coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR on get settings %o` + error, { className: "localeSetting.controller", methodName: "getSettings", CID: coId });
  } 
});

const createSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Create locale settings`, { className: "localeSetting.controller", methodName: "createSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "localeSetting.controller", methodName: "createSettings", CID: coId });

    const result = await localeSettingService.createSettings(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on create setting %o` + error, { className: "localeSetting.controller", methodName: "createSettings", CID: coId });
  } 
});

const updateSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update locale settings`, { className: "localeSetting.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "localeSetting.controller", methodName: "updateSettings", CID: coId });

    const result = await localeSettingService.updateSettings(req.body, coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on update setting %o` + error, { className: "localeSetting.controller", methodName: "updateSettings", CID: coId });
  } 
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
