const httpStatus = require('http-status');
const { ReportSetting } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const getSettings = async (coId) => {
  const result = await ReportSetting.find();
  logger.info(`Get Report Settings`, { className: "reportSetting.service", methodName: "getSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "reportSetting.service", methodName: "getSettings", CID: coId });
  return result;
};

const createSettings = async (reqBody,coId) => {
  const result = await ReportSetting.create(reqBody);
  logger.info(`Create Report Settings`, { className: "reportSetting.service", methodName: "createSettings" , CID: coId });
  logger.debug(`[DATA] %o` + result,  { className: "reportSetting.service", methodName: "createSettings", CID: coId });
  return result;
};

const updateSettings = async (reqBody,coId) => {
  const setting = await ReportSetting.findById(reqBody.id);
  if (!setting) {
    logger.error(`[NOT_FOUND] Settings not found`, { className: "reportSetting.service", methodName: "updateSettings", CID: coId });
    throw new ApiError(httpStatus.NOT_FOUND, 'Settings not found');
  }
  Object.assign(setting, reqBody);
  await setting.save();
  logger.info(`Update Report Settings`, { className: "reportSetting.service", methodName: "updateSettings" , CID: coId });
  logger.debug(`[DATA] %o` + setting,  { className: "reportSetting.service", methodName: "updateSettings", CID: coId });
  return setting;
};

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
